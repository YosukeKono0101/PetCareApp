const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Pet Care API",
    version: "1.0.0",
    description: "API documentation for the Pet Care application",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local server",
    },
  ],
  components: {
    schemas: {
      Pet: {
        type: "object",
        required: [
          "name",
          "type",
          "gender",
          "breed",
          "age",
          "weight",
          "birthDate",
        ],
        properties: {
          id: {
            type: "integer",
            description: "The auto-generated id of the pet",
          },
          name: {
            type: "string",
            description: "The name of the pet",
          },
          type: {
            type: "string",
            description: "The type of the pet (e.g., dog, cat)",
          },
          gender: {
            type: "string",
            description: "The gender of the pet",
          },
          breed: {
            type: "string",
            description: "The breed of the pet",
          },
          age: {
            type: "integer",
            description: "The age of the pet",
          },
          weight: {
            type: "number",
            description: "The weight of the pet in kg",
          },
          birthDate: {
            type: "string",
            format: "date",
            description: "The birth date of the pet",
          },
          user_id: {
            type: "integer",
            description: "The id of the user who owns the pet",
          },
        },
        example: {
          id: 1,
          name: "Max",
          type: "Dog",
          gender: "Male",
          breed: "Golden Retriever",
          age: 5,
          weight: 30.5,
          birthDate: "2018-01-01",
          user_id: 1,
        },
      },
      HealthLog: {
        type: "object",
        required: ["pet_id", "log_date", "details"],
        properties: {
          id: {
            type: "integer",
            description: "The auto-generated id of the health log",
          },
          pet_id: {
            type: "integer",
            description: "The id of the pet",
          },
          log_date: {
            type: "string",
            format: "date",
            description: "The date of the health log",
          },
          details: {
            type: "string",
            description: "The details of the health log",
          },
          user_id: {
            type: "integer",
            description: "The id of the user who created the log",
          },
        },
        example: {
          id: 1,
          pet_id: 1,
          log_date: "2022-01-01",
          details: "Annual check-up",
          user_id: 1,
        },
      },
      Vaccination: {
        type: "object",
        required: ["pet_id", "vaccine_name", "vaccination_date"],
        properties: {
          id: {
            type: "integer",
            description: "The auto-generated id of the vaccination",
          },
          pet_id: {
            type: "integer",
            description: "The id of the pet",
          },
          vaccine_name: {
            type: "string",
            description: "The name of the vaccine",
          },
          vaccination_date: {
            type: "string",
            format: "date",
            description: "The date of the vaccination",
          },
          user_id: {
            type: "integer",
            description: "The id of the user who created the log",
          },
        },
        example: {
          id: 1,
          pet_id: 1,
          vaccine_name: "Rabies",
          vaccination_date: "2022-01-01",
          user_id: 1,
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

module.exports = swaggerDefinition;
