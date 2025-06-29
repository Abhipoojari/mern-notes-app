const express = require("express");
const Note = require("../models/Note");

const router = express.Router();

// GET all notes
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// POST a new note
router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;
    const newNote = new Note({ title, content });
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(400).json({ error: "Failed to save note" });
  }
});
// DELETE a note by ID
router.delete("/:id", async (req, res) => {
  const noteId = req.params.id;
  await Note.findByIdAndDelete(noteId);
  res.status(200).json({ message: "Note deleted successfully" });
});

//update or edit a note
// Update a note by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        content: req.body.content,
      },
      { new: true } // return the updated note
    );

    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
