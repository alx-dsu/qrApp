module.exports = function (api) {
    api.cache(true);
    return {
      presets: [
        // ["babel-preset-expo", { jsxImportSource: "nativewind", unstable_transformProfile: 'hermes-stable' }],
        ["babel-preset-expo", { jsxImportSource: "nativewind" }],
        "nativewind/babel",
      ],
      // plugins: [
      //   // Usa las versiones transform (modernas) en lugar de proposal
      //   ['@babel/plugin-transform-class-properties', { loose: true }],
      //   ['@babel/plugin-transform-private-methods', { loose: true }],
      //   ['@babel/plugin-transform-private-property-in-object', { loose: true }],
      //   'expo-router/babel',
      //   // Añade este plugin para mejor soporte de Hermes
      //   ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
      // ],
    };
  };