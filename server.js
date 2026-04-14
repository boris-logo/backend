console.log("NEW SERVER FILE RUNNING");

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

// ================= CREATE APP ================= //
const app = express();

// ================= MIDDLEWARE ================= //
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// ================= SWAGGER CONFIGURATION ================= //
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HomeLink API',
      version: '1.0.0',
      description: 'A comprehensive real estate property management API',
      contact: {
        name: 'HomeLink API Support',
        email: 'support@homelink.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'User ID'
            },
            name: {
              type: 'string',
              description: 'User full name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            role: {
              type: 'string',
              enum: ['buyer', 'agent', 'admin'],
              description: 'User role'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp'
            }
          }
        },
        Property: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Property ID'
            },
            title: {
              type: 'string',
              description: 'Property title'
            },
            description: {
              type: 'string',
              description: 'Property description'
            },
            price: {
              type: 'number',
              format: 'decimal',
              description: 'Property price'
            },
            location: {
              type: 'string',
              description: 'Property location'
            },
            image: {
              type: 'string',
              description: 'Property image filename'
            },
            owner_id: {
              type: 'integer',
              description: 'Property owner user ID'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Property creation timestamp'
            }
          }
        },
        Message: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Message ID'
            },
            sender_id: {
              type: 'integer',
              description: 'Sender user ID'
            },
            receiver_id: {
              type: 'integer',
              description: 'Receiver user ID'
            },
            property_id: {
              type: 'integer',
              description: 'Related property ID'
            },
            content: {
              type: 'string',
              description: 'Message content'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Message timestamp'
            }
          }
        },
        Favorite: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Favorite ID'
            },
            user_id: {
              type: 'integer',
              description: 'User ID'
            },
            property_id: {
              type: 'integer',
              description: 'Property ID'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Favorite creation timestamp'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error message'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              description: 'Success message'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './server.js'] // Path to the API docs
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

console.log(`📚 API Documentation available at: http://localhost:${process.env.PORT || 5000}/api-docs`);

// ================= IMPORT ROUTES ================= //
const userRoutes = require('./routes/userRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const messageRoutes = require('./routes/messageRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');

// ================= USE ROUTES ================= //
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/favorites', favoriteRoutes); // ✅ NOW CORRECT

// ================= TEST ROUTE ================= //
/**
 * @swagger
 * /:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns a simple message to confirm the API is running
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running successfully
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "HomeLink API Running..."
 */
app.get('/', (req, res) => {
    res.send('HomeLink API Running...');
});

// ================= 404 HANDLER ================= //
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// ================= GLOBAL ERROR HANDLER ================= //
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// ================= START SERVER ================= //
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});