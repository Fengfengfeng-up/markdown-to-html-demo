const Vue = require('vue');
const fs = require('fs');
const marked = require('marked');
const pretty = require('pretty');
const { renderToString } = require('vue-server-renderer').createRenderer();

void async function main() {
  const posts = [
    {
      title: 'My First Blog Post',
      source: './my-first-blog-post.md',
      dest: './my-first-blog-post.html'
    }
  ];

  const postTemplate = fs.readFileSync('./post-template.html', 'utf8');

  for (const post of posts) {
    let content = fs.readFileSync(post.source, 'utf8');
    content = marked(content);
    const app = new Vue({
      template: postTemplate,
      data: () => ({ ...post, content })
    });
    // Write prettified HTML
    fs.writeFileSync(post.dest, pretty(await renderToString(app)));
  }

  const listTemplate = fs.readFileSync('./list-template.html', 'utf8');

  const app = new Vue({
    template: listTemplate,
    data: () => ({ posts })
  });

  fs.writeFileSync('./index.html', pretty(await renderToString(app)));
}();
