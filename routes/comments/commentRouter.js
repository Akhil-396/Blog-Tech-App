const express = require('express');
const { createCmtCtrl,commentDetailsCtrl, deleteComment, commentUpdate } = require('../../controllers/comments/commentController');
const protected = require('../../middlewares/protected')
const commentRouter = express.Router();


commentRouter.post('/:id',protected,createCmtCtrl)
commentRouter.get('/:id',commentDetailsCtrl)
commentRouter.delete('/:id',protected,deleteComment)
commentRouter.put('/:id',protected,commentUpdate)

    module.exports = commentRouter