import * as yup from 'yup';

export const PositionGroupSchema = yup.object({
  name: yup.string().required('Введите название'),
  spheres: yup.array().of(yup.string()).min(1, 'Выберите хотя бы одну сферу'),
  isArchived: yup.boolean().required(),
})