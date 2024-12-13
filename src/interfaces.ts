interface UserMock {
  name: string;
  age: number;
  roles: string[];
  createdAt: Date;
  isDeleated: boolean;
}

interface RequestMockItem {
  method: string;
  host: string;
  path: string;
  body?: UserMock;
  params: { id?: string };
}

interface Handlers<T> {
  next?: (value: T) => void;
  error?: (err: Error) => void;
  complete?: () => void;
}
