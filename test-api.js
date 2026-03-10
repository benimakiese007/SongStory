const http = require('http');

const test = (url) => {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: data }));
        }).on('error', reject);
    });
};

async function run() {
    try {
        console.log('Testing /api/list-covers...');
        const result = await test('http://localhost:3000/api/list-covers');
        console.log('Status:', result.status);
        console.log('Body:', result.body.substring(0, 200) + '...');
        if (result.status === 200) {
            const json = JSON.parse(result.body);
            console.log('Found', json.length, 'covers.');
        }
    } catch (e) {
        console.error('Test failed:', e.message);
    }
}

run();
