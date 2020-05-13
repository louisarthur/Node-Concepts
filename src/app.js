const express = require("express");
const cors = require("cors");
const isUrl = require("is-url");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  if (repositories.length === 0) {
    return response.json({ error: "don't have repositories" });
  }
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  if (!isUrl(url)) {
    return response.status(400).json({ error: "Url Invalid" });
  }

  const schemaRepositorie = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0,
  };
  repositories.push(schemaRepositorie);
  return response.json(schemaRepositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  if (!isUuid(id)) {
    return response.status(400).json({ error: "Bad request" });
  }
  const respoIndex = repositories.findIndex((repo) => repo.id === id);
  if (respoIndex < 0) {
    return response.status(404).json({ error: "repositorie not found" });
  }
  // const antes = repositories[respoIndex];
  repositories[respoIndex] = {
    ...repositories[respoIndex],
    url: url ? url : repositories[respoIndex].url,
    title: title ? title : repositories[respoIndex].title,
    techs: techs ? techs : repositories[respoIndex].techs,
  };
  const depois = repositories[respoIndex];

  return response.json(depois);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({ error: "Bad request" });
  }

  const respoIndex = repositories.findIndex((repo) => repo.id === id);

  repositories.splice(respoIndex, 1);

  return response.send(204);
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({ error: "Bad request" });
  }
  const respoIndex = repositories.findIndex((repo) => repo.id === id);

  repositories[respoIndex].likes += 1;

  return response.json(repositories[respoIndex]);
});

module.exports = app;
