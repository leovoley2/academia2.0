// Mock data para desarrollo sin MongoDB
interface MockUser {
  _id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'super_admin';
  isVerified: boolean;
  createdAt: string;
}

interface MockStudent {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  planId: string;
  paymentDate: string;
  nextBillingDate: string;
  avatarUrl: string;
  isActive: boolean;
  notes?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  createdBy: string;
  createdAt: string;
}

// Almacén en memoria para desarrollo
const mockStore = {
  users: [] as MockUser[],
  students: [] as MockStudent[],
  
  // Usuarios
  createUser(user: Omit<MockUser, '_id' | 'createdAt'>): MockUser {
    const newUser: MockUser = {
      _id: Date.now().toString(),
      ...user,
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    return newUser;
  },
  
  findUserByEmail(email: string): MockUser | null {
    return this.users.find(u => u.email === email.toLowerCase()) || null;
  },
  
  findUserById(id: string): MockUser | null {
    return this.users.find(u => u._id === id) || null;
  },
  
  // Estudiantes
  createStudent(student: Omit<MockStudent, '_id' | 'createdAt'>): MockStudent {
    const newStudent: MockStudent = {
      _id: Date.now().toString(),
      ...student,
      createdAt: new Date().toISOString()
    };
    this.students.push(newStudent);
    return newStudent;
  },
  
  findStudents(query: { isActive?: boolean } = {}): MockStudent[] {
    let results = [...this.students];
    
    if (query.isActive !== undefined) {
      results = results.filter(s => s.isActive === query.isActive);
    }
    
    return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  
  findStudentById(id: string): MockStudent | null {
    return this.students.find(s => s._id === id) || null;
  },
  
  updateStudent(id: string, updates: Partial<MockStudent>): MockStudent | null {
    const index = this.students.findIndex(s => s._id === id);
    if (index === -1) return null;
    
    this.students[index] = { ...this.students[index], ...updates };
    return this.students[index];
  },
  
  deleteStudent(id: string): boolean {
    const index = this.students.findIndex(s => s._id === id);
    if (index === -1) return false;
    
    this.students[index].isActive = false;
    return true;
  }
};

export { mockStore, type MockUser, type MockStudent };