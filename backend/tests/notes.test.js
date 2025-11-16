import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/server.js';
import User from '../src/models/User.js';
import Note from '../src/models/Note.js';

describe('Notes API Tests', () => {
  let token;
  let userId;

  beforeAll(async () => {
    // Clear data and create test user
    await User.deleteMany({});
    await Note.deleteMany({});

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

    token = res.body.data.token;
    userId = res.body.data.user._id;
  }, 30000);

  afterEach(async () => {
    // Clean up notes after each test
    await Note.deleteMany({});
  });

  describe('POST /api/notes', () => {
    it('should create a new note successfully', async () => {
      const res = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Note',
          content: '<p>This is test content</p>',
          tags: ['test', 'sample']
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('title', 'Test Note');
      expect(res.body.data.tags).toEqual(['test', 'sample']);
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .post('/api/notes')
        .send({
          title: 'Test Note',
          content: '<p>Content</p>'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should fail with missing title', async () => {
      const res = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: '<p>Content</p>'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should fail with missing content', async () => {
      const res = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Note'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should create note without tags', async () => {
      const res = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Note',
          content: '<p>Content</p>'
        });

      expect(res.status).toBe(201);
      expect(res.body.data.tags).toEqual([]);
    });
  });

  describe('GET /api/notes', () => {
    beforeEach(async () => {
      // Create test notes
      await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'First Note',
          content: '<p>First content</p>',
          tags: ['work']
        });

      await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Second Note',
          content: '<p>Second content</p>',
          tags: ['personal']
        });
    });

    it('should get all user notes', async () => {
      const res = await request(app)
        .get('/api/notes')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
    });

    it('should filter notes by search query', async () => {
      const res = await request(app)
        .get('/api/notes?search=First')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].title).toBe('First Note');
    });

    it('should filter notes by tag', async () => {
      const res = await request(app)
        .get('/api/notes?tag=work')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].tags).toContain('work');
    });

    it('should fail without authentication', async () => {
      const res = await request(app).get('/api/notes');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/notes/:id', () => {
    let noteId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Note',
          content: '<p>Content</p>'
        });
      noteId = res.body.data.id;
    });

    it('should get a specific note', async () => {
      const res = await request(app)
        .get(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Test Note');
    });

    it('should fail with invalid note ID', async () => {
      const res = await request(app)
        .get('/api/notes/invalid-id')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it('should fail for non-existent note', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/notes/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/notes/:id', () => {
    let noteId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Original Title',
          content: '<p>Original content</p>',
          tags: ['old']
        });
      noteId = res.body.data.id;
    });

    it('should update a note successfully', async () => {
      const res = await request(app)
        .put(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Title',
          content: '<p>Updated content</p>',
          tags: ['new']
        });

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Updated Title');
      expect(res.body.data.tags).toEqual(['new']);
    });

    it('should update only specified fields', async () => {
      const res = await request(app)
        .put(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Title'
        });

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Updated Title');
      expect(res.body.data.content).toBe('<p>Original content</p>');
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .put(`/api/notes/${noteId}`)
        .send({
          title: 'Updated Title'
        });

      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /api/notes/:id', () => {
    let noteId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Note',
          content: '<p>Content</p>'
        });
      noteId = res.body.data.id;
    });

    it('should delete a note successfully', async () => {
      const res = await request(app)
        .delete(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify note is deleted
      const getRes = await request(app)
        .get(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(getRes.status).toBe(404);
    });

    it('should fail without authentication', async () => {
      const res = await request(app).delete(`/api/notes/${noteId}`);

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/notes/tags/all', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Note 1',
          content: '<p>Content</p>',
          tags: ['work', 'important']
        });

      await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Note 2',
          content: '<p>Content</p>',
          tags: ['personal', 'work']
        });
    });

    it('should get all unique tags', async () => {
      const res = await request(app)
        .get('/api/notes/tags/all')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toContain('work');
      expect(res.body.data).toContain('important');
      expect(res.body.data).toContain('personal');
      expect(res.body.data.length).toBe(3);
    });
  });
});
