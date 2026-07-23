import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: change '/ulumba-compliance-tracker/' to match your GitHub repo name.
// If your repo is github.com/yourname/REPO, base must be '/REPO/'.
// If you're deploying to a USERNAME.github.io repo (a user/org site, not a project
// site), set base to '/' instead.
export default defineConfig({
  plugins: [react()],
  base: '',
})
