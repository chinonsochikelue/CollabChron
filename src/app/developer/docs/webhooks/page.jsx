"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Bell, Code, Copy, Check, ExternalLink } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ApiWebhooks() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState({})

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated") {
      setLoading(false)
    }
  }, [status, router])

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopied({ [id]: true })
    setTimeout(() => setCopied({}), 2000)
  }

  const webhookEvents = [
    {
      id: "post.created",
      name: "post.created",
      description: "Triggered when a new post is published",
      payload: {
        event: "post.created",
        created_at: "2025-05-18T15:30:45Z",
        data: {
          post_id: "post_123456",
          title: "Getting Started with Next.js",
          slug: "getting-started-with-nextjs",
          author: {
            id: "user_789012",
            name: "Jane Doe",
          },
          published_at: "2025-05-18T15:30:00Z",
        },
      },
    },
    {
      id: "post.updated",
      name: "post.updated",
      description: "Triggered when a post is updated",
      payload: {
        event: "post.updated",
        created_at: "2025-05-18T16:45:12Z",
        data: {
          post_id: "post_123456",
          title: "Getting Started with Next.js and React",
          slug: "getting-started-with-nextjs",
          author: {
            id: "user_789012",
            name: "Jane Doe",
          },
          updated_at: "2025-05-18T16:45:00Z",
        },
      },
    },
    {
      id: "comment.created",
      name: "comment.created",
      description: "Triggered when a new comment is added to a post",
      payload: {
        event: "comment.created",
        created_at: "2025-05-18T17:20:33Z",
        data: {
          comment_id: "comment_345678",
          post_id: "post_123456",
          post_title: "Getting Started with Next.js and React",
          author: {
            id: "user_901234",
            name: "John Smith",
          },
          content: "Great article! Very helpful for beginners.",
          created_at: "2025-05-18T17:20:30Z",
        },
      },
    },
    {
      id: "user.followed",
      name: "user.followed",
      description: "Triggered when a user follows another user",
      payload: {
        event: "user.followed",
        created_at: "2025-05-18T18:10:05Z",
        data: {
          follower: {
            id: "user_901234",
            name: "John Smith",
          },
          following: {
            id: "user_789012",
            name: "Jane Doe",
          },
          followed_at: "2025-05-18T18:10:00Z",
        },
      },
    },
  ]

  const codeExamples = {
    node: `const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

const WEBHOOK_SECRET = 'your_webhook_secret';

app.post('/webhook', (req, res) => {
  const signature = req.headers['x-collabchron-signature'];
  const payload = JSON.stringify(req.body);
  
  // Verify webhook signature
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const digest = hmac.update(payload).digest('hex');
  
  if (signature !== digest) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process the webhook event
  const event = req.body;
  
  switch (event.event) {
    case 'post.created':
      console.log('New post created:', event.data.title);
      // Handle new post
      break;
    case 'comment.created':
      console.log('New comment on post:', event.data.post_title);
      // Handle new comment
      break;
    // Handle other event types
    default:
      console.log('Unknown event type:', event.event);
  }
  
  res.status(200).send('Webhook received');
});

app.listen(3000, () => {
  console.log('Webhook server listening on port 3000');
});`,

    python: `from flask import Flask, request, jsonify
import hmac
import hashlib
import json

app = Flask(__name__)

WEBHOOK_SECRET = 'your_webhook_secret'

@app.route('/webhook', methods=['POST'])
def webhook():
    signature = request.headers.get('X-CollabChron-Signature')
    payload = request.data
    
    # Verify webhook signature
    digest = hmac.new(
        WEBHOOK_SECRET.encode('utf-8'),
        payload,
        hashlib.sha256
    ).hexdigest()
    
    if signature != digest:
        return jsonify({'error': 'Invalid signature'}), 401
    
    # Process the webhook event
    event = request.json
    
    if event['event'] == 'post.created':
        print(f"New post created: {event['data']['title']}")
        # Handle new post
    elif event['event'] == 'comment.created':
        print(f"New comment on post: {event['data']['post_title']}")
        # Handle new comment
    # Handle other event types
    else:
        print(f"Unknown event type: {event['event']}")
    
    return jsonify({'status': 'success'}), 200

if __name__ == '__main__':
    app.run(port=3000)`,

    php: `<?php
// webhook.php

$webhookSecret = 'your_webhook_secret';

// Get the raw POST data
$payload = file_get_contents('php://input');

// Get the signature from the headers
$signature = $_SERVER['HTTP_X_COLLABCHRON_SIGNATURE'] ?? '';

// Verify the signature
$calculatedSignature = hash_hmac('sha256', $payload, $webhookSecret);

if (!hash_equals($calculatedSignature, $signature)) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid signature']);
    exit;
}

// Parse the JSON payload
$event = json_decode($payload, true);

// Process the webhook event
switch ($event['event']) {
    case 'post.created':
        echo "New post created: " . $event['data']['title'] . "\\n";
        // Handle new post
        break;
    case 'comment.created':
        echo "New comment on post: " . $event['data']['post_title'] . "\\n";
        // Handle new comment
        break;
    // Handle other event types
    default:
        echo "Unknown event type: " . $event['event'] . "\\n";
}

// Return a success response
http_response_code(200);
echo json_encode(['status' => 'success']);`,
  }

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">API Webhooks</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="-ml-10 md:ml-0 container mx-auto py-8 px-4 max-w-screen">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-3xl font-bold">API Webhooks</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Receive real-time notifications when events happen in your CollabChron account
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-start gap-4">
            <Bell className="text-blue-500 mt-1" size={24} />
            <div>
              <h2 className="text-xl font-bold">Introduction to Webhooks</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Webhooks allow your application to receive real-time notifications when events happen in your
                CollabChron account. Instead of polling the API for changes, webhooks push data to your application as
                events occur.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b dark:border-gray-700">
            <h2 className="text-xl font-bold">Setting Up Webhooks</h2>
          </div>
          <div className="p-6">
            <div className="prose dark:prose-invert max-w-none">
              <p>
                To set up webhooks for your CollabChron account, you'll need to configure a webhook endpoint in your
                developer dashboard. Follow these steps:
              </p>

              <ol className="space-y-4 mt-4">
                <li className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-medium flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Go to your Developer Dashboard</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Navigate to the{" "}
                      <a href="/developer" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Developer Dashboard
                      </a>{" "}
                      in your CollabChron account.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-medium flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Create a new webhook endpoint</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Click on the "Webhooks" tab and then "Add Webhook Endpoint".
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-medium flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Enter your webhook URL</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Provide the URL where you want to receive webhook events. This should be a publicly accessible
                      endpoint on your server.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-medium flex-shrink-0">
                    4
                  </div>
                  <div>
                    <p className="font-medium">Select events to subscribe to</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Choose which events you want to receive notifications for (e.g., post.created, comment.created).
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-medium flex-shrink-0">
                    5
                  </div>
                  <div>
                    <p className="font-medium">Save your webhook configuration</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Click "Create Webhook" to save your configuration. You'll receive a webhook secret that you should
                      store securely.
                    </p>
                  </div>
                </li>
              </ol>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mt-6">
                <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300">Security Best Practices</h3>
                <p className="text-yellow-700 dark:text-yellow-200 mt-2">
                  Always verify webhook signatures to ensure the requests are coming from CollabChron. We include a
                  signature in the <code>X-CollabChron-Signature</code> header that you can verify using your webhook
                  secret.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b dark:border-gray-700">
            <h2 className="text-xl font-bold">Available Webhook Events</h2>
          </div>
          <div className="p-6">
            <div className="grid gap-6">
              {webhookEvents.map((event) => (
                <div key={event.id} className="border dark:border-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">{event.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{event.description}</p>
                  <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Example Payload</span>
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(event.payload, null, 2), event.id)}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        aria-label="Copy to clipboard"
                      >
                        {copied[event.id] ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                    <pre className="text-sm overflow-x-auto">
                      <code>{JSON.stringify(event.payload, null, 2)}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b dark:border-gray-700">
            <h2 className="text-xl font-bold">Implementing a Webhook Handler</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Here are examples of how to implement a webhook handler in different programming languages:
            </p>

            <Tabs defaultValue="node">
              <TabsList className="mb-4">
                <TabsTrigger value="node">Node.js</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="php">PHP</TabsTrigger>
              </TabsList>
              <TabsContent value="node">
                <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Node.js (Express)</span>
                    <button
                      onClick={() => copyToClipboard(codeExamples.node, "node-code")}
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      aria-label="Copy to clipboard"
                    >
                      {copied["node-code"] ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  <pre className="text-sm overflow-x-auto">
                    <code>{codeExamples.node}</code>
                  </pre>
                </div>
              </TabsContent>
              <TabsContent value="python">
                <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Python (Flask)</span>
                    <button
                      onClick={() => copyToClipboard(codeExamples.python, "python-code")}
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      aria-label="Copy to clipboard"
                    >
                      {copied["python-code"] ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  <pre className="text-sm overflow-x-auto">
                    <code>{codeExamples.python}</code>
                  </pre>
                </div>
              </TabsContent>
              <TabsContent value="php">
                <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">PHP</span>
                    <button
                      onClick={() => copyToClipboard(codeExamples.php, "php-code")}
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      aria-label="Copy to clipboard"
                    >
                      {copied["php-code"] ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  <pre className="text-sm overflow-x-auto">
                    <code>{codeExamples.php}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b dark:border-gray-700">
            <h2 className="text-xl font-bold">Best Practices</h2>
          </div>
          <div className="p-6">
            <div className="prose dark:prose-invert max-w-none">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Code className="text-blue-500 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-medium">Verify webhook signatures</p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Always verify the signature in the <code>X-CollabChron-Signature</code> header to ensure the
                      webhook is coming from CollabChron.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Code className="text-blue-500 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-medium">Respond quickly</p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Your webhook endpoint should respond with a 200 status code as quickly as possible. Process the
                      webhook data asynchronously if needed.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Code className="text-blue-500 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-medium">Implement retry logic</p>
                    <p className="text-gray-600 dark:text-gray-300">
                      If your endpoint is temporarily unavailable, we'll retry the webhook delivery with an exponential
                      backoff. Make sure your handler is idempotent.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Code className="text-blue-500 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-medium">Monitor webhook deliveries</p>
                    <p className="text-gray-600 dark:text-gray-300">
                      You can view webhook delivery history in your developer dashboard to troubleshoot any issues.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Code className="text-blue-500 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-medium">Use HTTPS</p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Always use HTTPS for your webhook endpoints to ensure data is encrypted in transit.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <ExternalLink className="text-blue-500 mt-1" size={24} />
            <div>
              <h2 className="text-xl font-bold text-blue-700 dark:text-blue-300">Ready to Get Started?</h2>
              <p className="text-blue-600 dark:text-blue-200 mt-2">
                Head over to your Developer Dashboard to set up your first webhook endpoint and start receiving
                real-time notifications.
              </p>
              <a
                href="/developer"
                className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
              >
                Go to Developer Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
