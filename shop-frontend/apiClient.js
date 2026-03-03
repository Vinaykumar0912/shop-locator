
// // const API_BASE = "http://localhost:4000/api";
// const API_BASE = "https://shop-locator-v2.vercel.app/api";

// function getToken() {
//   return localStorage.getItem("token");
// }

// function authHeaders(isJson = true) {
//   const headers = {};
//   if (isJson) headers["Content-Type"] = "application/json";
//   const token = getToken();
//   if (token) headers["Authorization"] = "Bearer " + token;
//   return headers;
// }

// const auth = {
//   async signInWithPassword({ email, password }) {
//     const res = await fetch(`${API_BASE}/auth/login`, {
//       method: "POST",
//       headers: authHeaders(),
//       body: JSON.stringify({ email, password })
//     });
//     const data = await res.json();
//     if (!res.ok) return { data: null, error: data };
    
//     // Store token for future authenticated requests
//     localStorage.setItem("token", data.token);
//     return { data, error: null };
//   },

//   async signUp({ email, password, options }) {
//     const res = await fetch(`${API_BASE}/auth/register`, {
//       method: "POST",
//       headers: authHeaders(),
//       body: JSON.stringify({
//         email,
//         password,
//         full_name: options?.data?.full_name,
//         role: options?.data?.role || "owner"
//       })
//     });
//     const data = await res.json();
//     if (!res.ok) return { data: null, error: data };
//     return { data, error: null };
//   },

//   async signOut() {
//     localStorage.removeItem("token");
//     return { error: null };
//   },

//   async getUser() {
//     const res = await fetch(`${API_BASE}/auth/me`, {
//       headers: authHeaders(false)
//     });
//     if (!res.ok) return { data: { user: null }, error: true };
//     const user = await res.json();
//     return { data: { user }, error: null };
//   }
// };

// function from(table) {
//   let query = `${API_BASE}/${table}`;
//   let filters = [];
//   let orderBy = "";

//   return {
//     select() { return this; },
//     eq(col, val) { filters.push(`${col}=${val}`); return this; },
//     in(col, arr) { filters.push(`${col}=${arr.join(",")}`); return this; },
//     order(col, opts) {
//       orderBy = `order=${col}&dir=${opts?.ascending === false ? "desc" : "asc"}`;
//       return this;
//     },
//     async single() {
//       const res = await fetch(`${query}?${filters.join("&")}&${orderBy}`, { headers: authHeaders(false) });
//       const data = await res.json();
//       return { data, error: res.ok ? null : data };
//     },
//     async insert(payload) {
//       const res = await fetch(query, {
//         method: "POST",
//         headers: authHeaders(),
//         body: JSON.stringify(payload[0] ?? payload)
//       });
//       const data = await res.json();
//       return { data, error: res.ok ? null : data };
//     },
//     async update(payload) {
//       const id = payload.id;
//       delete payload.id;
//       const res = await fetch(`${query}/${id}`, {
//         method: "PUT",
//         headers: authHeaders(),
//         body: JSON.stringify(payload)
//       });
//       const data = await res.json();
//       return { data, error: res.ok ? null : data };
//     },
//     async delete() {
//       const id = filters.find(f => f.startsWith("id="))?.split("=")[1];
//       const res = await fetch(`${query}/${id}`, {
//         method: "DELETE",
//         headers: authHeaders(false)
//       });
//       const data = await res.json();
//       return { data, error: res.ok ? null : data };
//     }
//   };
// }

// export const api = {
//   auth,
//   from,
//   storage: {
//     from() {
//       return {
//         upload() { return { data: null, error: { message: "Image upload disabled" } }; },
//         getPublicUrl() { return { data: { publicUrl: null } }; }
//       };
//     }
//   }
// };
// apiClient.js
const API_BASE = "https://shop-locator-v2.vercel.app/api";

function getToken() {
  return localStorage.getItem("token");
}

function authHeaders(isJson = true) {
  const headers = {};
  if (isJson) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export const api = {
  auth: {
    async signInWithPassword({ email, password }) {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) return { data: null, error: data };
      
      // ✅ SAVE TOKEN IMMEDIATELY
      localStorage.setItem("token", data.token);
      return { data, error: null };
    },

    async signUp({ email, password, options }) {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          full_name: options?.data?.full_name,
          role: options?.data?.role || "owner"
        })
      });
      const data = await res.json();
      return { data, error: res.ok ? null : data };
    },

    async verifyOTP({ email, otp }) {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      return { data, error: res.ok ? null : data };
    }
  },

  from(table) {
    const query = `${API_BASE}/${table}`;
    let filters = [];
    let orderBy = "";

    return {
      select(columns = "*") {
        filters.push(`select=${columns}`);
        return this;
      },
      eq(column, value) {
        filters.push(`${column}=eq.${value}`);
        return this;
      },
      order(column, { ascending = true } = {}) {
        orderBy = `order=${column}.${ascending ? "asc" : "desc"}`;
        return this;
      },
      async single() {
        const res = await fetch(`${query}?${filters.join("&")}&${orderBy}`, { 
            headers: authHeaders(false) 
        });
        const data = await res.json();
        return { data, error: res.ok ? null : data };
      },
      async insert(payload) {
        const res = await fetch(query, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify(payload[0] ?? payload)
        });
        const data = await res.json();
        return { data, error: res.ok ? null : data };
      },
      async update(payload) {
        const id = payload.id;
        const body = { ...payload };
        delete body.id;
        const res = await fetch(`${query}/${id}`, {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify(body)
        });
        const data = await res.json();
        return { data, error: res.ok ? null : data };
      },
      async delete() {
        const id = filters.find(f => f.startsWith("id=eq."))?.split(".")[1];
        const res = await fetch(`${query}/${id}`, {
          method: "DELETE",
          headers: authHeaders(false)
        });
        const data = await res.json();
        return { data, error: res.ok ? null : data };
      }
    };
  }
};