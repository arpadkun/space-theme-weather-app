# Cosmic Weather App 🌌☄️

A space-themed weather application that displays current weather information with cosmic visuals. This project demonstrates a simple but effective implementation of a weather app with a unique galactic theme.

## Features

- **Space-themed UI**: Planets, stars, and cosmic events represent weather conditions
- **Current Weather**: Get real-time weather data for any location
- **Unit Toggle**: Switch between Celsius and Fahrenheit
- **Responsive Design**: Works on desktop and mobile devices
- **User Preferences**: Saved locally for a personalized experience

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express
- **Weather Data**: OpenWeatherMap API
- **Testing**: Jest

## Prerequisites

- Node.js (v14 or higher)
- NPM or Yarn
- OpenWeatherMap API key (get one for free at [OpenWeatherMap](https://openweathermap.org/api))

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cosmic-weather-app.git
   cd cosmic-weather-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create an environment file:
   ```bash
   cp .env.sample .env
   ```

4. Add your OpenWeatherMap API key to the `.env` file:
   ```
   WEATHER_API_KEY=your_api_key_here
   ```

## Usage

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### Production

Start the production server:

```bash
npm start
```

### Testing

Run all tests:

```bash
npm test
```

Run only unit tests:

```bash
npm run test:unit
```

Run only integration tests:

```bash
npm run test:integration
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run tests with coverage report:

```bash
npm run test:coverage
```

## Project Structure

```
/
├── public/              # Static files
│   ├── css/            # Stylesheets
│   ├── js/             # Client-side JavaScript
│   ├── images/         # Image assets
│   └── index.html      # Main HTML file
├── src/                # Server-side code
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Express middleware
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   └── utils/          # Utility functions
├── tests/              # Test files
│   ├── unit/           # Unit tests
│   └── integration/    # Integration tests
├── .env.sample         # Sample environment variables
├── .gitignore          # Git ignore file
├── package.json        # Project dependencies and scripts
├── server.js           # Entry point
└── README.md           # This file
```

## Setting up Bitrise CI

This project can be easily integrated with Bitrise CI for automated testing and deployment.

### Setup Steps

1. **Register on Bitrise**: Sign up at [bitrise.io](https://bitrise.io)

2. **Add Your App**: Connect your GitHub/GitLab/Bitbucket repository

3. **Configure Workflows**: Set up the following workflows:

### Recommended Workflows

#### 1. Primary Workflow (on pull requests and commits to main branch)

- **Install Dependencies**: Run `npm install`
- **Linting**: Run `npm run lint`
- **Testing**: Run `npm test`

#### 2. Deploy Workflow (on tags or releases)

- **Build**: Create a production build
- **Test**: Run all tests with `npm test`
- **Deploy**: Deploy to your hosting environment

### Example Bitrise.yml Configuration

```yaml
---
format_version: '11'
default_step_lib_source: https://github.com/bitrise-io/bitrise-steplib.git
project_type: node
trigger_map:
- push_branch: main
  workflow: primary
- pull_request_target_branch: "*"
  workflow: primary
- tag: "*"
  workflow: deploy
workflows:
  primary:
    steps:
    - activate-ssh-key@4:
        run_if: '{{getenv "SSH_RSA_PRIVATE_KEY" | ne ""}}'
    - git-clone@6: {}
    - npm@1:
        inputs:
        - command: install
    - npm@1:
        inputs:
        - command: run lint
    - npm@1:
        title: Run Unit Tests
        inputs:
        - command: run test:unit
    - npm@1:
        title: Run Integration Tests
        inputs:
        - command: run test:integration
  deploy:
    steps:
    - activate-ssh-key@4:
        run_if: '{{getenv "SSH_RSA_PRIVATE_KEY" | ne ""}}'
    - git-clone@6: {}
    - npm@1:
        inputs:
        - command: install
    - npm@1:
        title: Run Unit Tests
        inputs:
        - command: run test:unit
    - npm@1:
        title: Run Integration Tests
        inputs:
        - command: run test:integration
    # Add your deployment steps here
```

### Environment Variables

Add the following environment variables in Bitrise:

- `WEATHER_API_KEY`: Your OpenWeatherMap API key

Make sure to mark sensitive variables (like API keys) as Protected.

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

halllow :)
