import type { User, Student } from '../types';

// --- UTILITIES ---

// Simula el hash de contraseñas de forma segura
const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Simula la latencia de la red
const networkDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- MOCK DATABASE (localStorage) ---

const getUsers = (): User[] => {
    return JSON.parse(localStorage.getItem('academy_users') || '[]');
};

const saveUsers = (users: User[]) => {
    localStorage.setItem('academy_users', JSON.stringify(users));
};

// Inicializa el usuario administrador si no existe
(async () => {
    await networkDelay(100);
    if (!localStorage.getItem('academy_users')) {
        const passwordHash = await hashPassword('password');
        const adminUser: User = {
            id: 'admin',
            email: 'admin@example.com',
            passwordHash,
            isVerified: true
        };
        saveUsers([adminUser]);
    }
})();


// --- AUTH API ---

export const api = {
    async login(email: string, password: string): Promise<{ success: true; user: { email: string } } | { success: false; message: string }> {
        await networkDelay(500);
        const users = getUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) return { success: false, message: 'Usuario no encontrado.' };
        if (!user.isVerified) return { success: false, message: 'Tu cuenta no ha sido verificada. Por favor, revisa tu correo electrónico.' };

        const passwordHash = await hashPassword(password);
        if (user.passwordHash !== passwordHash) return { success: false, message: 'Contraseña incorrecta.' };
        
        return { success: true, user: { email: user.email } };
    },

    async register(email: string, password: string): Promise<{ success: true; verificationToken: string } | { success: false; message: string }> {
        await networkDelay(700);
        const users = getUsers();
        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            return { success: false, message: 'Un usuario con este correo electrónico ya existe.' };
        }

        const passwordHash = await hashPassword(password);
        const token = crypto.randomUUID();
        const newUser: User = { id: crypto.randomUUID(), email, passwordHash, isVerified: false, verificationToken: token };
        saveUsers([...users, newUser]);
        
        return { success: true, verificationToken: token };
    },

    async verifyAccount(token: string): Promise<{ success: boolean; message: string }> {
        await networkDelay(300);
        const users = getUsers();
        const userIndex = users.findIndex(u => u.verificationToken === token);

        if (userIndex !== -1) {
            users[userIndex].isVerified = true;
            delete users[userIndex].verificationToken;
            saveUsers(users);
            return { success: true, message: '¡Cuenta verificada exitosamente! Ahora puedes iniciar sesión.' };
        }
        return { success: false, message: 'Token de verificación inválido o expirado.' };
    },

    async requestPasswordReset(email: string): Promise<{ success: true; resetToken?: string; message: string }> {
        await networkDelay(500);
        const users = getUsers();
        const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

        const genericMessage = 'Si existe una cuenta con este correo, se ha enviado un enlace de recuperación.';

        if (userIndex === -1) {
            return { success: true, message: genericMessage }; // Devuelve éxito pero sin token por seguridad
        }

        const token = crypto.randomUUID();
        const expires = Date.now() + 3600000; // 1 hora
        users[userIndex].resetPasswordToken = token;
        users[userIndex].resetPasswordExpires = expires;
        saveUsers(users);

        return { success: true, resetToken: token, message: genericMessage };
    },

    async resetPassword(token: string, password: string): Promise<{ success: boolean; message: string }> {
        await networkDelay(600);
        const users = getUsers();
        const userIndex = users.findIndex(u => u.resetPasswordToken === token && u.resetPasswordExpires && u.resetPasswordExpires > Date.now());

        if (userIndex === -1) {
            return { success: false, message: 'El token es inválido o ha expirado. Por favor, solicita un nuevo enlace de recuperación.' };
        }

        users[userIndex].passwordHash = await hashPassword(password);
        delete users[userIndex].resetPasswordToken;
        delete users[userIndex].resetPasswordExpires;
        saveUsers(users);

        return { success: true, message: 'Contraseña actualizada exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.' };
    },

    // --- STUDENTS API ---

    async getStudents(): Promise<Student[]> {
        await networkDelay(800);
        const data = localStorage.getItem('academy_students');
        if (!data) {
             // Si no hay estudiantes, inicializa con los de ejemplo y guárdalos
            const { INITIAL_STUDENTS } = await import('../constants');
            localStorage.setItem('academy_students', JSON.stringify(INITIAL_STUDENTS));
            return INITIAL_STUDENTS;
        }
        return JSON.parse(data);
    },

    async saveStudent(student: Student): Promise<Student> {
        await networkDelay(400);
        const students: Student[] = JSON.parse(localStorage.getItem('academy_students') || '[]');
        const existingIndex = students.findIndex(s => s.id === student.id);

        if (existingIndex > -1) {
            students[existingIndex] = student;
        } else {
            students.push(student);
        }
        localStorage.setItem('academy_students', JSON.stringify(students));
        return student;
    },

    async deleteStudent(studentId: string): Promise<{ success: boolean }> {
        await networkDelay(400);
        const students: Student[] = JSON.parse(localStorage.getItem('academy_students') || '[]');
        const updatedStudents = students.filter(s => s.id !== studentId);
        localStorage.setItem('academy_students', JSON.stringify(updatedStudents));
        return { success: true };
    }
};
