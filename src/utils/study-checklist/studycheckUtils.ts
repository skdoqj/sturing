//TODO:캐시처리할것

export async function postTodoInfo(data: any) {
  try {
    const response = await fetch(`http://localhost:3000/api/study-todo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    console.log('Server Response:', result);
    return result;
  } catch (error) {
    console.log('Error checkList info', error);
  }
}
export async function fetchTodoInfo(data: any) {
  try {
    const response = await fetch(`http://localhost:3000/api/study-todo`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return Response.json({ message: '성공' });
  } catch (error) {
    console.log('Error checkList info', error);
  }
}

export async function DeleteTodoInfo(data: any) {
  try {
    const response = await fetch(`http://localhost:3000/api/study-todo`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return Response.json({ message: '성공' });
  } catch (error) {
    console.log(error);
  }
}
