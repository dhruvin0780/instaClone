const Joi = require("joi");

function validatePost(data) {
	const postValidationSchema = Joi.object({
		image_url: Joi.string().required(),
		caption: Joi.string().allow(null),
		likes: Joi.object({
			count: Joi.number().default(0),
			users: Joi.array().items(
				Joi.object({
					id: Joi.string(),
					username: Joi.string(),
				}),
			),
		}),
		comments: Joi.array().items(
			Joi.object({
				user: Joi.object({
					id: Joi.string(),
					username: Joi.string(),
				}),
				text: Joi.string(),
				createdAt: Joi.date(),
			}),
		),
		createdAt: Joi.date(),
		createdBy: Joi.object({
			id: Joi.string(),
			username: Joi.string(),
		}),
		updatedAt: Joi.date(),
	});

	return postValidationSchema.validate(data);
}

module.exports = validatePost;
