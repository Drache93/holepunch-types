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
import * as b4a from "b4a";
import { encode, decode } from "z32";

// TypeScript will now provide full type support for these modules
```

## 📦 Modules Covered

- `autobase` ⚡
- `blind-pairing` 🕶️
- `hyperswarm` 🌐
- `z32` 🔢
- `b4a` 🧩

> **Note:** This is not a conclusive list or fully tested. More modules may be added as the ecosystem grows and as usage expands.

---

## 🙏 Thanks

Special thanks to the folks at [Holepunch](https://holepunch.to) for their groundbreaking work on these projects! This package is community-maintained and **not officially affiliated** with Holepunch or the upstream projects.

## 🤝 Contributing

Contributions, suggestions, and corrections are very welcome! Please open an issue or pull request if you spot a problem or want to add more types.

## 📜 License

MIT — see [LICENSE](./LICENSE)
