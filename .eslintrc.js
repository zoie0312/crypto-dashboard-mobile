module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "react-native/react-native": true,
    },
    // "extends": [
    //     "eslint:recommended",
    //     "plugin:react/recommended"
    // ],
    "extends": [
        "universe/native", 
        "plugin:react-hooks/recommended",
        "prettier",
        "plugin:prettier/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true,
        },
        "ecmaVersion": "latest",
        "sourceType": "module",
    },
    "plugins": ["react", "react-native", "react-hooks", "prettier"],
    "rules": {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "prettier/prettier": "warn",
    },
};
