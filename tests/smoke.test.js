const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const htmlPath = path.join(root, 'index.html');
const cssPath = path.join(root, 'styles.css');
const jsPath = path.join(root, 'script.js');

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function test(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    console.error(error.message);
    process.exitCode = 1;
  }
}

class ClassList {
  constructor() {
    this.values = new Set();
  }

  add(name) {
    this.values.add(name);
  }

  remove(name) {
    this.values.delete(name);
  }

  toggle(name, force) {
    const shouldAdd = force === undefined ? !this.values.has(name) : Boolean(force);
    if (shouldAdd) {
      this.add(name);
    } else {
      this.remove(name);
    }
    return shouldAdd;
  }

  contains(name) {
    return this.values.has(name);
  }
}

class Element {
  constructor({ href = '', offsetTop = 0, src = '', alt = '', dataset = {} } = {}) {
    this.href = href;
    this.src = src;
    this.alt = alt;
    this.dataset = dataset;
    this.offsetTop = offsetTop;
    this.textContent = '';
    this.classList = new ClassList();
    this.listeners = {};
    this.attrs = {};
    this.focused = false;
  }

  addEventListener(type, listener) {
    this.listeners[type] = listener;
  }

  dispatch(type, event = {}) {
    assert.strictEqual(typeof this.listeners[type], 'function', `${type} listener is registered`);
    this.listeners[type](event);
  }

  focus() {
    this.focused = true;
  }

  setAttribute(name, value) {
    this.attrs[name] = String(value);
  }

  getAttribute(name) {
    return this.attrs[name] || 'false';
  }
}

function createFakeBrowser() {
  const navToggle = new Element();
  const siteNav = new Element();
  const bookingForm = new Element();
  const bookingStatus = new Element();
  const backToTop = new Element();
  const homeSection = new Element({ offsetTop: 0 });
  const menuSection = new Element({ offsetTop: 1000 });
  const atmosferaSection = new Element({ offsetTop: 1400 });
  const contactSection = new Element({ offsetTop: 1800 });
  const navLink = new Element({ href: '#menu' });
  const contactLink = new Element({ href: '#contact' });
  const reveal = new Element();
  const galleryButtons = [
    new Element({
      dataset: {
        lightboxSrc: 'assets/img/476373582_17980328069803579_2840000815807261178_n.jpg',
        lightboxAlt: 'Parlament atmosfera 1',
      },
    }),
    new Element({
      dataset: {
        lightboxSrc: 'assets/img/497897772_17991769274803579_6275967440067032338_n.jpg',
        lightboxAlt: 'Parlament atmosfera 2',
      },
    }),
  ];
  const lightbox = new Element();
  const lightboxImage = new Element();
  const lightboxClose = new Element();
  const lightboxPrev = new Element();
  const lightboxNext = new Element();
  const listeners = {};
  const scrollCalls = [];

  homeSection.attrs.id = 'home';
  menuSection.attrs.id = 'menu';
  atmosferaSection.attrs.id = 'atmosfera';
  contactSection.attrs.id = 'contact';
  navLink.attrs.href = '#menu';
  contactLink.attrs.href = '#contact';

  const document = {
    body: new Element(),
    addEventListener(type, listener) {
      listeners[type] = listener;
    },
    dispatch(type) {
      assert.strictEqual(typeof listeners[type], 'function', `${type} listener is registered`);
      listeners[type]();
    },
    querySelector(selector) {
      return {
        '.nav-toggle': navToggle,
        '.site-nav': siteNav,
        '#booking-form': bookingForm,
        '.booking-status': bookingStatus,
        '.back-to-top': backToTop,
        '#home': homeSection,
        '#menu': menuSection,
        '#atmosfera': atmosferaSection,
        '#contact': contactSection,
        '.lightbox': lightbox,
        '.lightbox-image': lightboxImage,
        '.lightbox-close': lightboxClose,
        '.lightbox-prev': lightboxPrev,
        '.lightbox-next': lightboxNext,
      }[selector] || null;
    },
    querySelectorAll(selector) {
      if (selector === '.site-nav a') return [navLink, contactLink];
      if (selector === 'section[id]') return [homeSection, menuSection, atmosferaSection];
      if (selector === 'section[id], footer[id]') return [homeSection, menuSection, atmosferaSection, contactSection];
      if (selector === '.reveal') return [reveal];
      if (selector === '.gallery-button') return galleryButtons;
      return [];
    },
  };

  const window = {
    location: {
      href: '',
    },
    pageYOffset: 0,
    scrollTo(options) {
      scrollCalls.push(options);
      window.pageYOffset = Number(options.top || 0);
    },
    addEventListener(type, listener) {
      listeners[`window:${type}`] = listener;
    },
    dispatch(type, event = {}) {
      assert.strictEqual(typeof listeners[`window:${type}`], 'function', `${type} listener is registered`);
      listeners[`window:${type}`](event);
    },
  };

  return {
    document,
    window,
    navToggle,
    bookingForm,
    bookingStatus,
    backToTop,
    navLink,
    contactLink,
    reveal,
    galleryButtons,
    lightbox,
    lightboxImage,
    lightboxClose,
    lightboxPrev,
    lightboxNext,
    scrollCalls,
  };
}

test('page exposes the responsive single-page structure', () => {
  const html = read(htmlPath);

  assert.match(html, /<html lang="bs">/);
  assert.match(html, /<title>Parlament \| Nargila Caffe Bar Kakanj<\/title>/);
  assert.match(html, /Parlament Kakanj/);
  assert.match(html, /Alije Izetbegovića 15, Kakanj/);
  assert.match(html, /07:00 - 23:00/);
  assert.match(html, /Kuća prirode/);
  assert.match(html, /Jana/);
  assert.match(html, /Sarajevski kiseljak/);

  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1\.0">/);
  assert.match(html, /href="styles\.css"/);
  assert.match(html, /src="script\.js"/);
  assert.match(html, /aria-label="Glavna navigacija"/);
  assert.match(html, /class="nav-toggle"/);
  assert.match(html, /id="booking-form"/);

  ['home', 'reservations', 'hours', 'atmosfera', 'menu', 'promotions', 'contact'].forEach((id) => {
    assert.match(html, new RegExp(`id="${id}"`), `section ${id} exists`);
  });

  assert.match(html, /href="#atmosfera"/);
  assert.match(html, /class="gallery-grid"/);
  assert.match(html, /class="lightbox"/);
  assert.match(html, /viber:\/\/chat\?number=387644421927\//);
  assert.match(html, /Viber: 064 442 1927/);
});

test('all referenced local visual assets use the original image folder and exist', () => {
  const html = read(htmlPath);
  const css = read(cssPath);
  const sources = [...html.matchAll(/(?:src|href)="(assets\/[^"]+)"/g), ...css.matchAll(/url\(["']?(assets\/[^"')]+)["']?\)/g)]
    .map((match) => match[1])
    .filter((source) => !source.startsWith('assets/#'));

  assert.ok(sources.length >= 35, 'site references a complete local image set');
  sources.forEach((source) => {
    assert.ok(source.startsWith('assets/img/'), `${source} uses an original image`);
    assert.ok(fs.existsSync(path.join(root, source)), `${source} exists`);
  });
});

test('visually hidden controls are removed from keyboard flow', () => {
  const html = read(htmlPath);
  const css = read(cssPath);

  assert.doesNotMatch(html, /class="hero-controls" aria-hidden="true"[\s\S]{0,500}<button\b/, 'decorative hidden regions do not contain buttons');
  assert.match(css, /\.back-to-top\s*{[\s\S]*visibility:\s*hidden;[\s\S]*pointer-events:\s*none;/);
  assert.match(css, /\.back-to-top\.is-visible\s*{[\s\S]*visibility:\s*visible;[\s\S]*pointer-events:\s*auto;/);
  assert.match(css, /\.lightbox\s*{[\s\S]*visibility:\s*hidden;[\s\S]*pointer-events:\s*none;/);
  assert.match(css, /\.lightbox\.is-open\s*{[\s\S]*visibility:\s*visible;[\s\S]*pointer-events:\s*auto;/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*\.site-nav\s*{[\s\S]*visibility:\s*hidden;[\s\S]*pointer-events:\s*none;[\s\S]*body\.nav-open \.site-nav\s*{[\s\S]*visibility:\s*visible;[\s\S]*pointer-events:\s*auto;/);
});

test('script toggles nav, submits booking feedback, and scrolls to top', () => {
  const script = read(jsPath);
  const browser = createFakeBrowser();

  vm.runInNewContext(script, {
    document: browser.document,
    window: browser.window,
    IntersectionObserver: undefined,
  });

  browser.document.dispatch('DOMContentLoaded');

  browser.navToggle.dispatch('click');
  assert.strictEqual(browser.navToggle.getAttribute('aria-expanded'), 'true');
  assert.ok(browser.document.body.classList.contains('nav-open'));

  let prevented = false;
  browser.bookingForm.dispatch('submit', {
    preventDefault() {
      prevented = true;
    },
  });
  assert.ok(prevented, 'booking submit prevents navigation');
  assert.match(browser.bookingStatus.textContent, /Otvaramo Viber/);
  assert.ok(browser.bookingStatus.classList.contains('is-visible'));
  assert.match(browser.window.location.href, /^viber:\/\/chat\?number=387644421927\/$/);

  browser.backToTop.dispatch('click');
  const scrollCall = browser.scrollCalls.pop();
  assert.strictEqual(scrollCall.top, 0);
  assert.strictEqual(scrollCall.behavior, 'smooth');

  browser.window.pageYOffset = 1900;
  browser.window.dispatch('scroll');
  assert.ok(browser.contactLink.classList.contains('is-active'));
});

test('script opens, navigates, and closes the atmosphere lightbox', () => {
  const script = read(jsPath);
  const browser = createFakeBrowser();

  vm.runInNewContext(script, {
    document: browser.document,
    window: browser.window,
    IntersectionObserver: undefined,
  });

  browser.document.dispatch('DOMContentLoaded');

  let prevented = false;
  browser.galleryButtons[0].dispatch('click', {
    preventDefault() {
      prevented = true;
    },
  });

  assert.ok(prevented, 'gallery click prevents default button behavior');
  assert.ok(browser.lightbox.classList.contains('is-open'));
  assert.ok(browser.document.body.classList.contains('lightbox-open'));
  assert.strictEqual(browser.lightboxImage.src, 'assets/img/476373582_17980328069803579_2840000815807261178_n.jpg');
  assert.strictEqual(browser.lightboxImage.alt, 'Parlament atmosfera 1');
  assert.ok(browser.lightboxClose.focused, 'close button receives focus');

  browser.lightboxNext.dispatch('click');
  assert.strictEqual(browser.lightboxImage.src, 'assets/img/497897772_17991769274803579_6275967440067032338_n.jpg');
  assert.strictEqual(browser.lightboxImage.alt, 'Parlament atmosfera 2');

  browser.window.dispatch('keydown', { key: 'ArrowLeft' });
  assert.strictEqual(browser.lightboxImage.src, 'assets/img/476373582_17980328069803579_2840000815807261178_n.jpg');

  browser.lightboxClose.dispatch('click');
  assert.ok(!browser.lightbox.classList.contains('is-open'));
  assert.ok(!browser.document.body.classList.contains('lightbox-open'));
});
