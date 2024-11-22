export async function fetchUserData(token: string) {
  const response = await fetch('/api/user', {
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
  const response = await fetch('/api/logout', {
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
  const response = await fetch('/api/users', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
} 