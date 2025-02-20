npm install
```

## Development Mode

To run the application in development mode:
```bash
npm run dev
```

The application will be available at `http://your-server-ip:8080`

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start
```

The application will be available at `http://your-server-ip:8080`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=8080 # Optional, defaults to 8080
NODE_ENV=production