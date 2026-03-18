import http from 'k6/http';
import { check, group, sleep } from 'k6';

// Configuration for different test scenarios
export const options = {
  stages: [
    { duration: '2m', target: 20 },   // Ramp up to 20 users
    { duration: '3m', target: 50 },   // Ramp to 50 users
    { duration: '4m', target: 100 },  // Ramp to 100 users
    { duration: '5m', target: 150 },  // Peak: 150 users
    { duration: '3m', target: 50 },   // Ramp down to 50
    { duration: '2m', target: 0 },    // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.1'],
  },
};

const BASE_URL = 'http://localhost:5173'; // Change to your deployment URL for production testing

export default function() {
  group('Landing Page Load', function() {
    let response = http.get(`${BASE_URL}/`);
    
    check(response, {
      'status is 200': (r) => r.status === 200,
      'page loads in < 3s': (r) => r.timings.duration < 3000,
      'response size > 0': (r) => r.body.length > 0,
    });
  });

  sleep(1);

  group('Navigation Links', function() {
    const sections = ['about', 'workflow', 'tools', 'prompts', 'coupon', 'team', 'certification'];
    
    sections.forEach((section) => {
      let response = http.get(`${BASE_URL}/#${section}`);
      check(response, {
        [`${section} section accessible`]: (r) => r.status === 200,
      });
      sleep(0.5);
    });
  });

  sleep(1);

  group('Team Images Loading', function() {
    const images = [
      '/parth.jpeg',
      '/parth_p.jpeg',
      '/meet.jpeg',
      '/prithvi.jpeg',
      '/dhyey.jpeg',
      '/janvi.jpeg',
      '/disha.jpeg',
      '/p_ai.jpeg',
    ];

    images.forEach((image) => {
      let response = http.get(`${BASE_URL}${image}`);
      check(response, {
        [`image ${image} loads`]: (r) => r.status === 200,
        [`image ${image} < 5s`]: (r) => r.timings.duration < 5000,
      });
    });
  });

  sleep(1);

  group('Chat Feature Interaction', function() {
    let response = http.get(`${BASE_URL}/`);
    
    check(response, {
      'chat feature loads': (r) => r.status === 200,
      'page stays responsive': (r) => r.timings.duration < 2000,
    });
  });

  sleep(2);
}
