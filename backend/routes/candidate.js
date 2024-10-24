
const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const Candidate = require('../models/Candidate')
const fetchUser = require('../middleware/fetchUser')
const User = require('../models/User')

// Route 1: Adding the Candidate using: POST "/api/candidate/addCandidate"
router.post('/addCandidate', fetchUser, [
    body('name').isLength({ min: 5 }).withMessage('Enter the name'),
    body('partyname').isLength({ min: 5 }).withMessage('Enter the party name')
], async (req, res) => {
    try {
        const { name, partyname, url } = req.body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const candidate = new Candidate({
            name, partyname, url, user: req.user.id, votes: 0
        })
        const savedCandidate = await candidate.save()
        res.json(savedCandidate)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error')
    }
})

// Route 2: Editing the Candidate using: PUT "/api/candidate/updateCandidate/:id"
router.put('/updateCandidate/:id', fetchUser, async (req, res) => {
    const { name, partyname, url } = req.body
    try {
        const newCandidate = {}
        if (name) {
            newCandidate.name = name
        }
        if (partyname) {
            newCandidate.partyname = partyname
        }
        if (url) {
            newCandidate.url = url
        }

        // Find the candidate to be updated & update it
        let updateCandidate = await Candidate.findById(req.params.id)

        if (!updateCandidate) {
            return res.status(404).send('Candidate Not Found')
        }

        updateCandidate = await Candidate.findByIdAndUpdate(req.params.id, { $set: newCandidate }, { new: true })
        res.send(updateCandidate)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error')
    }
})

//Route 3: Delete the Candidate using: DELETE "/api/candidate/delete/:id"
router.delete("/deleteCandidate/:id", fetchUser, async function (req, res) {
    try {
        // Find the note to be detele & delete it
        let candidate = await Candidate.findById(req.params.id)
        if (!candidate) {
            return res.status(404).send("No candidate found")
        }

        candidate = await Candidate.findByIdAndDelete(req.params.id)
        res.json({ 'Success': 'Note has been deleted Successfully', candidate: candidate })
    } catch (err) {
        console.error(err.message);
        console.log(err.lineNumber);
        res.status(500).send("Server error!");
    }
});

// Route 4: Vote the Candidate using: PUT "/api/candidate/vote/:id"
router.put("/vote/:id", fetchUser, async (req, res) => {
    try {
        let updateVote = await Candidate.findById(req.params.id)
        let user = await User.findOne({ id: req.user.id })

        if (!updateVote) {
            return res.status(404).send("Candidate not found")
        }

        if (user && user.upVote) {
            return res.status(400).send('Already Voted')
        }

        updateVote = await Candidate.findByIdAndUpdate(req.params.id, { $inc: { "votes": 1 }, $set: { upVote: true } }, { new: true })

        user = await User.updateOne(
            { id: req.user.id },
            { $set: { upVote: true } },
            { new: true }
        );

    } catch (error) {
        console.error(error.message);
        console.log(error.lineNumber);
        res.status(500).send('Internal Server Error')
    }
})

// Route 5: Get the Maxmimum Number of Votes aquired by Candidate using GET: "/api/candidate/mavVotesCandidate"
router.get('/maxVotesCandidate', fetchUser, async (req, res) => {

    const candidates = await Candidate.find({});

    // Find the candidate with the maximum votes using JavaScript
    let maxVotesCandidate;
    let maxVotes = 0;

    for (const candidate of candidates) {
        if (candidate.votes > maxVotes) {
            maxVotesCandidate = candidate;
            maxVotes = candidate.votes;
            continue
        }
    }

    res.json({ maxVotesCandidate });

})

// ROUTE 6: Fetch all notes using: POST "api/candidates/fetchallnotes". Login required
router.get('/fetchallcandidates', fetchUser, async (req, res) => {
    try {
        const candidates = await Candidate.find({})
        res.json(candidates)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error')
    }
})

module.exports = router
