const HtmlWebpackPlugin = require('html-webpack-plugin');

// 创建对应 rel 和 href 的 link 标签
function createLinkTag({ rel, href, attributes = {} }) {
  return {
    tagName: 'link',
    voidTag: true,
    attributes: {
      rel,
      href,
      ...attributes
    }
  };
}

class PreloadOptimizePlugin {
  constructor({ staticLinkTags = [], preloadPatterns = [] } = {}) {
    this.staticLinkTags = staticLinkTags;
    this.preloadPatterns = preloadPatterns.length > 0 ? preloadPatterns : [
      // { pattern: /\.(woff2?|ttf|eot)$/i, as: 'font', attributes: { crossorigin: 'anonymous' }}
    ];
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('PreloadImagePlugin', compilation => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(
        'PreloadImagePlugin', (data, cb) => {
          let publicPath = compilation.options.output.publicPath;
          // auto 表示 publicPath 未被配置
          publicPath = publicPath.trim() === "auto" ? '' : publicPath;

          // 生成符合条件的预加载标签
          const preloadTags = this.preloadPatterns.flatMap(({ pattern, as, attributes, media = [] }) => {
            return Object.keys(compilation.assets)
              .filter(asset => pattern.test(asset))
              .map(asset => {
                // console.log('asset: ', asset);

                return createLinkTag({
                  rel: 'preload',
                  href: `${publicPath || ''}${asset}`,
                  attributes: { 
                    as,
                    ...attributes, ...this.extraLinkAttributes }
                });
              });
          });

          // 使用静态配置生成 DNS Prefetch 和 Preconnect 标签
          const staticLinks = this.staticLinkTags.map(tag => createLinkTag(tag));          

          // 在 headTags 最前面插入静态和动态生成的标签
          data.headTags = [
            ...staticLinks,
            ...preloadTags,
            ...data.headTags
          ];

          cb(null, data);
        }
      );
    });
  }
}


module.exports = PreloadOptimizePlugin