const {override, addDecoratorsLegacy,fixBabelImports,addLessLoader} = require('customize-cra');

module.exports = override(fixBabelImports('import', {libraryName: 'antd',libraryDirectory: 'es', style: 'css',}),
    addDecoratorsLegacy(),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: { '@base-color': '#f44336' }
    })
);

