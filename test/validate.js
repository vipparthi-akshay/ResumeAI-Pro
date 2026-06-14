/**
 * Automated validation tests for AI Resume Builder
 * Run: node test/validate.js
 */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`  PASS: ${name}`);
        passed++;
    } catch (e) {
        console.log(`  FAIL: ${name} - ${e.message}`);
        failed++;
    }
}

function assert(condition, message) {
    if (!condition) throw new Error(message);
}

function fileExists(relPath) {
    return fs.existsSync(path.join(root, relPath));
}

function readFile(relPath) {
    return fs.readFileSync(path.join(root, relPath), 'utf8');
}

console.log('\n=== File Existence Tests ===');

const requiredFiles = [
    'index.html', 'builder.html', 'dashboard.html', 'login.html', 'signup.html',
    'js/app.js', 'js/builder.js', 'js/ai.js', 'js/pdf.js', 'js/theme.js',
    'js/dashboard.js', 'js/auth.js', 'js/storage.js',
    'images/avatars/avatar-1.svg', 'images/avatars/avatar-2.svg',
    'images/avatars/avatar-3.svg', 'images/avatars/avatar-4.svg',
    'images/hero-image.svg',
    'images/templates/modern-template.svg',
    'images/templates/executive-template.svg',
    'images/templates/creative-template.svg'
];

requiredFiles.forEach(f => {
    test(`${f} exists`, () => assert(fileExists(f), 'file missing'));
});

console.log('\n=== HTML Script Loading Tests ===');

test('builder.html loads builder.js', () => {
    const html = readFile('builder.html');
    assert(html.includes('js/builder.js'), 'builder.js not loaded');
});

test('builder.html loads html2pdf CDN', () => {
    const html = readFile('builder.html');
    assert(html.includes('html2pdf'), 'html2pdf CDN missing');
});

test('builder.html uses SVG avatars', () => {
    const html = readFile('builder.html');
    assert(!html.includes('avatar-1.jpg'), 'still references jpg avatars');
    assert(html.includes('avatar-1.svg'), 'missing svg avatar ref');
});

test('login.html loads auth.js', () => {
    const html = readFile('login.html');
    assert(html.includes('js/auth.js'), 'auth.js not loaded');
    assert(html.includes('id="loginForm"'), 'loginForm id missing');
});

console.log('\n=== JavaScript Content Tests ===');

test('app.js defines ResumeApp class', () => {
    const js = readFile('js/app.js');
    assert(js.includes('class ResumeApp'), 'ResumeApp class missing');
});

test('builder.js defines photoUpload handler safely', () => {
    const js = readFile('js/builder.js');
    assert(js.includes('getElementById("photoUpload")'), 'photoUpload lookup missing');
    assert(!js.match(/^photoUpload\.addEventListener/m), 'unsafe top-level photoUpload reference');
});

test('builder.js defines updateProgress', () => {
    const js = readFile('js/builder.js');
    assert(js.includes('function updateProgress'), 'updateProgress missing');
    assert(js.includes('animateProgressBar'), 'animateProgressBar missing');
});

test('pdf.js has downloadPDF method', () => {
    const js = readFile('js/pdf.js');
    assert(js.includes('downloadPDF'), 'downloadPDF missing');
});

test('auth.js has login handler', () => {
    const js = readFile('js/auth.js');
    assert(js.includes('loginForm'), 'login handler missing');
});

test('dashboard.js initializes on dashboard-container', () => {
    const js = readFile('js/dashboard.js');
    assert(js.includes('.dashboard-container'), 'dashboard init condition wrong');
});

console.log('\n=== Image Reference Tests ===');

['index.html', 'dashboard.html', 'builder.html'].forEach(page => {
    test(`${page} has no .jpg avatar references`, () => {
        const html = readFile(page);
        assert(!html.match(/avatars\/avatar-\d+\.jpg/), 'jpg avatar refs remain');
    });
});

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);
process.exit(failed > 0 ? 1 : 0);
