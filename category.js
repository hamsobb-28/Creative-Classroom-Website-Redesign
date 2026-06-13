const params = new URLSearchParams(window.location.search);
const pageKey = params.get("page") || "about-us";
const pages = window.CATEGORY_PAGES || {};
const page = pages[pageKey] || pages["about-us"];

const title = document.querySelector("[data-category-title]");
const kicker = document.querySelector("[data-category-kicker]");
const summary = document.querySelector("[data-category-summary]");
const image = document.querySelector("[data-category-image]");
const actions = document.querySelector("[data-category-actions]");
const content = document.querySelector("[data-category-content]");

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function addLinks(container, links) {
  if (!links?.length) return;
  const group = element("div", "category-link-group");
  links.forEach((link) => {
    const anchor = element("a", "text-link", link.label);
    anchor.href = link.href;
    if (/^https?:/.test(link.href)) {
      anchor.target = "_blank";
      anchor.rel = "noopener";
    }
    group.append(anchor);
  });
  container.append(group);
}

function renderSection(section) {
  const article = element("article", "category-section");
  article.append(element("h2", "", section.heading));

  section.body?.forEach((paragraph) => {
    article.append(element("p", "", paragraph));
  });

  if (section.list?.length) {
    const list = element("ul", "category-list");
    section.list.forEach((item) => list.append(element("li", "", item)));
    article.append(list);
  }

  if (section.cards?.length) {
    const cards = element("div", "category-card-grid");
    section.cards.forEach((item) => {
      if (typeof item === "string") {
        cards.append(element("div", "category-mini-card", item));
        return;
      }

      const card = item.href
        ? element("a", "category-mini-card linked-card")
        : element("div", "category-mini-card");
      if (item.href) card.href = item.href;
      card.append(element("strong", "", item.title));
      if (item.meta) card.append(element("span", "", item.meta));
      cards.append(card);
    });
    article.append(cards);
  }

  if (section.images?.length) {
    const gallery = element("div", "event-image-grid");
    section.images.forEach((item) => {
      const figure = element("figure", "event-image-card");
      const image = element("img");
      image.src = item.src;
      image.alt = item.alt || item.caption || "Creative Classroom event image";
      figure.append(image);
      if (item.caption) figure.append(element("figcaption", "", item.caption));
      gallery.append(figure);
    });
    article.append(gallery);
  }

  if (section.people?.length) {
    const people = element("div", "people-grid");
    section.people.forEach((person) => {
      const card = element("article", "person-card");
      if (person.image) {
        const image = element("img", "person-photo");
        image.src = person.image;
        image.alt = `${person.name} headshot`;
        card.append(image);
      }
      card.append(element("h3", "", person.name));
      card.append(element("p", "person-role", person.role));
      card.append(element("p", "", person.bio));
      people.append(card);
    });
    article.append(people);
  }

  addLinks(article, section.links);
  return article;
}

if (page) {
  document.title = `${page.kicker} | Creative Classroom`;
  title.textContent = page.title;
  kicker.textContent = page.kicker;
  summary.textContent = page.summary;
  image.src = page.image;
  image.alt = `${page.kicker} page visual`;

  page.actions?.forEach((action) => {
    const anchor = element("a", `button ${action.style || "secondary"}`, action.label);
    anchor.href = action.href;
    if (action.external || /^https?:/.test(action.href)) {
      anchor.target = "_blank";
      anchor.rel = "noopener";
    }
    actions.append(anchor);
  });

  page.sections.forEach((section) => {
    content.append(renderSection(section));
  });
}
