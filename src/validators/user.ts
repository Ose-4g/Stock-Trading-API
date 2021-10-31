import Joi from 'joi';

const updateDetailsSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  phoneNumber: Joi.string(),
});

export { updateDetailsSchema };
