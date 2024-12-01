import type { User } from '../types/auth'

export async function fetchUserData(token: string) {
  const response = await fetch('/api/auth/user', {
    headers: {
      'authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }

  return response.json();
}

export async function logoutUser(refreshToken: string) {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: refreshToken }),
  });

  if (!response.ok) {
    console.error(response);
    throw new Error('Logout failed');
  }
}

export async function fetchAllUsers(token: string) {
  const response = await fetch('/api/auth/users', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
}

interface AddMemberData {
  name: string;
  password: string;
}

export async function addMember(token: string, data: AddMemberData) {
  const response = await fetch('/api/auth/addmember', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Failed to add member');
  }
} 

interface delMemberData {
  name: string;
}

export async function delMember(token: string, data: delMemberData) {
  const response = await fetch('/api/auth/delmember', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Failed to delete member');
  }
} 

export async function loginUser(name: string, password: string): Promise<User> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, password }),
  })

  if (!response.ok) {
    throw new Error('Login failed')
  }

  return response.json()
} 
