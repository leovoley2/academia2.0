import express from 'express';
import { Student } from '../../src/models/Student.js';
import type { Student as StudentType, ApiResponse, PlanId } from '../../src/types.js';

const router = express.Router();

// Obtener todos los estudiantes
router.get('/', async (req: express.Request, res: express.Response) => {
  try {
    const students = await Student.find({ isActive: true })
      .populate('createdBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    const formattedStudents: StudentType[] = students.map(student => ({
      id: student._id.toString(),
      name: student.name,
      email: student.email,
      phone: student.phone,
      planId: student.planId as PlanId,
      paymentDate: student.paymentDate.toISOString().split('T')[0],
      nextBillingDate: student.nextBillingDate.toISOString().split('T')[0],
      avatarUrl: student.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=0ea5e9&color=fff`,
      isActive: student.isActive,
      notes: student.notes,
      emergencyContact: student.emergencyContact
    }));

    const response: ApiResponse<StudentType[]> = {
      success: true,
      data: formattedStudents,
      message: 'Estudiantes obtenidos exitosamente'
    };

    res.json(response);
  } catch (error) {
    console.error('Error obteniendo estudiantes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener un estudiante por ID
router.get('/:id', async (req: express.Request, res: express.Response) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('createdBy', 'firstName lastName email');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Estudiante no encontrado'
      });
    }

    const formattedStudent: StudentType = {
      id: student._id.toString(),
      name: student.name,
      email: student.email,
      phone: student.phone,
      planId: student.planId as PlanId,
      paymentDate: student.paymentDate.toISOString().split('T')[0],
      nextBillingDate: student.nextBillingDate.toISOString().split('T')[0],
      avatarUrl: student.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=0ea5e9&color=fff`,
      isActive: student.isActive,
      notes: student.notes,
      emergencyContact: student.emergencyContact
    };

    const response: ApiResponse<StudentType> = {
      success: true,
      data: formattedStudent,
      message: 'Estudiante obtenido exitosamente'
    };

    res.json(response);
  } catch (error) {
    console.error('Error obteniendo estudiante:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Crear nuevo estudiante
router.post('/', async (req: express.Request, res: express.Response) => {
  try {
    const studentData = req.body;

    // Calcular siguiente fecha de facturación (30 días después)
    const paymentDate = new Date(studentData.paymentDate);
    const nextBillingDate = new Date(paymentDate);
    nextBillingDate.setDate(nextBillingDate.getDate() + 30);

    const student = new Student({
      ...studentData,
      paymentDate,
      nextBillingDate,
      isActive: true,
      createdBy: '670dbf123456789012345678' // TODO: Usar el ID real del usuario autenticado
    });

    await student.save();

    const formattedStudent: StudentType = {
      id: student._id.toString(),
      name: student.name,
      email: student.email,
      phone: student.phone,
      planId: student.planId as PlanId,
      paymentDate: student.paymentDate.toISOString().split('T')[0],
      nextBillingDate: student.nextBillingDate.toISOString().split('T')[0],
      avatarUrl: student.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=0ea5e9&color=fff`,
      isActive: student.isActive,
      notes: student.notes,
      emergencyContact: student.emergencyContact
    };

    const response: ApiResponse<StudentType> = {
      success: true,
      data: formattedStudent,
      message: 'Estudiante creado exitosamente'
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creando estudiante:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Actualizar estudiante
router.put('/:id', async (req: express.Request, res: express.Response) => {
  try {
    const studentData = req.body;
    
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        ...studentData,
        paymentDate: studentData.paymentDate ? new Date(studentData.paymentDate) : undefined,
        nextBillingDate: studentData.nextBillingDate ? new Date(studentData.nextBillingDate) : undefined
      },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Estudiante no encontrado'
      });
    }

    const formattedStudent: StudentType = {
      id: student._id.toString(),
      name: student.name,
      email: student.email,
      phone: student.phone,
      planId: student.planId as PlanId,
      paymentDate: student.paymentDate.toISOString().split('T')[0],
      nextBillingDate: student.nextBillingDate.toISOString().split('T')[0],
      avatarUrl: student.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=0ea5e9&color=fff`,
      isActive: student.isActive,
      notes: student.notes,
      emergencyContact: student.emergencyContact
    };

    const response: ApiResponse<StudentType> = {
      success: true,
      data: formattedStudent,
      message: 'Estudiante actualizado exitosamente'
    };

    res.json(response);
  } catch (error) {
    console.error('Error actualizando estudiante:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Eliminar estudiante (soft delete)
router.delete('/:id', async (req: express.Request, res: express.Response) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Estudiante no encontrado'
      });
    }

    const response: ApiResponse = {
      success: true,
      message: 'Estudiante eliminado exitosamente'
    };

    res.json(response);
  } catch (error) {
    console.error('Error eliminando estudiante:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

export default router;