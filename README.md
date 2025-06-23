# holepunch-types 🛠️

> **Unofficial TypeScript type definitions for the Holepunch ecosystem**

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

Welcome! This package provides TypeScript type definitions for key modules in the [Holepunch](https://holepunch.to) ecosystem, making it easier for TypeScript developers to build on top of these amazing peer-to-peer tools.

## 📦 Installation

```bash
npm install holepunch-types
# or
yarn add holepunch-types
# or
bun add holepunch-types
```

## 🚀 Usage

Once installed, the type definitions will be automatically available when you import the corresponding modules:

```typescript
import Autobase from "autobase";
import Hyperswarm from "hyperswarm";
import BlindPairing from "blind-pairing";
import ReadyResource from "ready-resource";
import Corestore from "corestore";
import Hyperbee from "hyperbee";
import Hyperblobs from "hyperblobs";
import Hyperdrive from "hyperdrive";
import * as b4a from "b4a";
import { encode, decode } from "z32";

// TypeScript will now provide full type support for these modules
```

## 📦 Modules Covered

### Core Infrastructure

- `autobase` ⚡ - Append-only log with automatic linearization
- `blind-pairing` 🕶️ - Secure peer discovery and pairing
- `corestore` 📦 - Hypercore factory and storage management
- `hyperswarm` 🌐 - Distributed peer discovery and networking
- `ready-resource` 🔧 - Resource lifecycle management

### Data Storage & File Systems

- `hyperbee` 🐝 - Sorted key-value store built on Hypercore
- `hyperblobs` 💾 - Binary large object storage
- `hyperdrive` 🚗 - P2P file system and versioning

### Utilities

- `z32` 🔢 - Base32 encoding/decoding
- `b4a` 🧩 - Buffer utilities for Node.js and browsers

> **Note:** This is not a conclusive list or fully tested. More modules may be added as the ecosystem grows and as usage expands.

## 🔧 Type Coverage

The type definitions include:

- **Full API coverage** for all public methods and properties
- **Proper inheritance** and interface implementations
- **Event emitter support** with typed events
- **Async iterator support** where applicable
- **Comprehensive options interfaces** for all method parameters
- **Stream support** for read/write operations
- **Batch operations** with proper typing
- **Versioning and snapshot support**

## 🎯 Key Features

- **Zero configuration** - Types are automatically available
- **Complete IntelliSense** - Full autocomplete and type checking
- **Event handling** - Properly typed event listeners and emitters
- **Async operations** - Full support for promises and async/await
- **Stream operations** - Typed read/write streams
- **Batch processing** - Efficient batch operations with type safety

---

## 🙏 Thanks

Special thanks to the folks at [Holepunch](https://holepunch.to) for their groundbreaking work on these projects! This package is community-maintained and **not officially affiliated** with Holepunch or the upstream projects.

## 🤝 Contributing

Contributions, suggestions, and corrections are very welcome! Please open an issue or pull request if you spot a problem or want to add more types.

## 📜 License

MIT — see [LICENSE](./LICENSE)
