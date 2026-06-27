import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../validators/validate.js';
import { teamMemberSchema } from '../validators/team.js';
import { getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } from '../controllers/team.js';

const router = express.Router();

router.get('/', getTeamMembers);
router.post('/', authenticate, validate(teamMemberSchema), createTeamMember);
router.patch('/:id', authenticate, validate(teamMemberSchema), updateTeamMember);
router.delete('/:id', authenticate, deleteTeamMember);

export default router;
