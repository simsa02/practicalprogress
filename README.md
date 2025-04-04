# Practical Progress - Next.js Application

## Fix for White Screen Issue

If you're experiencing a white screen with only basic HTML content showing, follow these steps to fix the issue:


## How to Fix

### Option 1: Using Node.js Script (Recommended)

1. Open a command prompt in the `frontend` directory
2. Run the following command:
   ```
   node rebuild.js
   ```
3. This will:
   - Clean the Next.js cache
   - Install dependencies
   - Build the application
   - Start the server

### Option 2: Using Batch Files

1. Open a PowerShell window in the `frontend` directory
2. Run the following command:
   ```
   .\start-app.bat
   ```
   
   Note: If you get a permission error, try:
   ```
   powershell -ExecutionPolicy Bypass -File .\start-app.bat
   ```

### Option 3: Manual Steps

If the above options don't work, follow these manual steps:

1. Open a command prompt in the `frontend` directory
2. Run the following commands:
   ```
   rmdir /s /q .next
   rmdir /s /q node_modules\.cache
   npm install
   npm run build
   npm run start
   ```

### Accessing the Application

After running any of the above options, access your application at:
http://localhost:3000

## Troubleshooting

If you still see a white screen:

1. Open browser developer tools (F12)
2. Check the Console tab for JavaScript errors
3. Check the Network tab for failed requests
4. Make sure all CSS and JavaScript files are loading properly

## Project Structure

- `pages/`: Next.js pages (including _app.js and _document.js)
- `components/`: React components
- `styles/`: CSS modules and global styles
- `data/`: Data files for the application
- `public/`: Static assets

## Recent Changes Made to Fix the Issue

1. Added proper global CSS imports in _app.js
2. Enhanced _document.js with proper meta tags
3. Created a Node.js rebuild script for easier debugging
4. Created proper CSS loading structure

## Next.js vs Create React App

This project was originally bootstrapped with Create React App but has been migrated to Next.js. The main differences are:

- Next.js uses a `pages/` directory for routing
- Server-side rendering is available
- The build process is different
- CSS modules are handled differently

For more information, see the [Next.js documentation](https://nextjs.org/docs).
