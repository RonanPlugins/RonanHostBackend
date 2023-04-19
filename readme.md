# RonanHost Backend

RonanHost is a platform for hosting Minecraft game servers. This repository contains the backend code for RonanHost.

## Getting Started

To get started with RonanHost backend, follow these steps:

1. Clone the repository to your local machine.
2. Install the project dependencies using `npm install`.
3. Copy `.env.example` to `.env` and update the environment variables with your own values.
4. Run the development server using `npm run dev`.

For more detailed instructions, please see the [documentation](./docs/).

## Contributing

We welcome contributions to RonanHost backend! To contribute, please read our [contribution guidelines](./contributing.md).

## Bug Reports and Feature Requests

If you encounter a bug or have a feature request, please create an issue in the [RonanHost Backend issue tracker](https://github.com/ronanhost/backend/issues) on GitHub.

## License

RonanHost backend is licensed under the [MIT License](./LICENSE).

Logs:\
`journalctl -u RonanHostApi.service -n 100 --no-pager`

Service:\
`RonanHostApi.service`
