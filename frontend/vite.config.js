import react from '@vitejs/plugin-react'
// import dotenv from 'dotenv'
import { defineConfig } from 'vite'

// dotenv.config()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()]
  // define: {
  //   // eslint-disable-next-line no-undef
  //   'process.env': process.env
  // }
})
