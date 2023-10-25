![image](https://github.com/mstauber/DogMoneyMode/assets/2897796/f932a886-7b03-4448-adaa-8beb074b79f7)

# DogMoneyMode
Browser extension that automatically converts fiat prices to display in Dogecoin. Supports most popular sites. Fiat Supported: USD, EUR, GBP, INR, & RUB.

![image](https://github.com/UsaRandom/DogMoneyMode/assets/2897796/9a8f55ac-28c8-474c-8151-df2f01f23e64)

![output-onlinegiftools](https://github.com/mstauber/DogMoneyMode/assets/2897796/4907b0f4-ba41-455a-9144-0f5ce61da743)


# Install


You can easily add DogMoneyMode to Chrome and Edge via major browser addon stores.

[Edge/Chrome Install](https://chrome.google.com/webstore/detail/dogmoneymode/biohgaaeeifjpamlfinoloeomblpbnfm)

[Firefox Install](https://addons.mozilla.org/en-US/firefox/addon/dogmoneymode/)


# Build

## Prerequisites

- Node.js and npm.

## Install Dependencies

```bash
npm install
```

## Build for Chrome/Edge

Run webpack to build the chrome/edge version of the extension (outputs to ./build/)

```bash
webpack --config webpack.chrome.config.js
```

## Build for Firefox

Run webpack to build the firefox version of the extension (outputs to ./build/)

```bash
webpack --config webpack.firefox.config.js
```




Inspired by https://github.com/qlpqlp/dogefy
