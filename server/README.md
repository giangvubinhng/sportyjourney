# Sportbook API Server

A Go API server built with PocketBase.

## Prerequisites

- **Go 1.24.0 or later** - [Download Go](https://go.dev/dl/)
- **Git** - For cloning and version control

## Getting Started

### 1. Install Dependencies

From the `server` directory, install the Go dependencies:

```bash
go mod download
```

Or simply run:

```bash
go mod tidy
```

This will ensure all dependencies listed in `go.mod` are downloaded and available.

### 2. Run the Server

Start the development server:

```bash
go run ./cmd/server/ serve --http=0.0.0.0:8090
```

### Migrate Data 
(Optional)
   ```bash
   go run .\cmd\server\ migrate
   ```  

The server will start and be available at `http://127.0.0.1:8090` by default (PocketBase default port).

### 3. Build the Server

To build a binary executable:

```bash
go build -o bin/server cmd/server/main.go
```

Then run the binary:

```bash
./bin/server
```

## Project Structure

```
server/
├── cmd/
│   └── server/
│       └── main.go          # Application entry point
├── pb_data/                 # PocketBase data directory (SQLite databases)
│   ├── data.db             # Main database
│   ├── auxiliary.db        # Auxiliary database
│   └── backups/            # Database backups
├── go.mod                   # Go module dependencies
├── go.sum                   # Dependency checksums
└── README                   # This file
```

## Development

### Hot Reload (Optional)

For a better development experience with automatic reloading, you can use tools like:

- [Air](https://github.com/cosmtrek/air) - Live reload for Go apps
- [CompileDaemon](https://github.com/githubnemo/CompileDaemon) - Simple file watcher

Example with Air:

```bash
# Install Air
go install github.com/cosmtrek/air@latest

# Run with Air (from server directory)
air
```

### Environment Variables

PocketBase supports various environment variables for configuration. Common ones include:

- `PB_ENCRYPTION_KEY` - Encryption key for sensitive data
- `PB_DATA_DIR` - Custom data directory (default: `./pb_data`)
- `PB_PUBLIC_DIR` - Public static files directory (default: `./pb_public`)

### Static Files

The server is configured to serve static files from `./pb_public` directory (if it exists). Create this directory and add your static assets there.

## PocketBase Admin UI

When the server is running, you can access the PocketBase Admin UI at:

```
http://127.0.0.1:8090/_/
```

On first run, you'll be prompted to create an admin account.

## Database

PocketBase uses SQLite by default, stored in the `pb_data` directory. The database files are:

- `data.db` - Main application database
- `auxiliary.db` - Auxiliary database for system operations

**Note:** The `pb_data` directory should not be committed to version control in production. Make sure it's in your `.gitignore`.

## Troubleshooting

### Port Already in Use

If port 8090 is already in use, you can specify a different port:

```bash
go run cmd/server/main.go serve --http=127.0.0.1:8091
```

### Database Issues

If you encounter database issues, you can reset the database by:

1. Stopping the server
2. Deleting the `pb_data` directory (or backing it up)
3. Restarting the server (a new database will be created)

### Dependency Issues

If you encounter dependency issues:

```bash
go mod tidy
go mod download
```

## Additional Resources

- [PocketBase Documentation](https://pocketbase.io/docs/)
- [Go Documentation](https://go.dev/doc/)
