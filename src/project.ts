class Observer<T> {
  isUnsubscribed: boolean;
  handlers: Handlers<T>;
  _unsubscribe?: () => void;

  constructor(handlers: Handlers<T>) {
    this.handlers = handlers;
    this.isUnsubscribed = false;
  }

  next(value: T) {
    if (this.handlers.next && !this.isUnsubscribed) {
      this.handlers.next(value);
    }
  }

  error(error: Error) {
    if (!this.isUnsubscribed) {
      if (this.handlers.error) {
        this.handlers.error(error);
      }
      this.unsubscribe();
    }
  }

  complete() {
    if (!this.isUnsubscribed) {
      if (this.handlers.complete) {
        this.handlers.complete();
      }
      this.unsubscribe();
    }
  }

  unsubscribe() {
    this.isUnsubscribed = true;
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }
}

class Observable<T> {
  _subscribe: (observer: Observer<T>) => () => void;

  constructor(subscribe: (observer: Observer<T>) => () => void) {
    this._subscribe = subscribe;
  }

  static from<T>(values: T[]): Observable<T> {
    return new Observable<T>((observer) => {
      values.forEach((value) => observer.next(value));
      if (observer.complete) {
        observer.complete();
      }
      return () => {
        console.log("unsubscribed");
      };
    });
  }

  subscribe(handlers: Handlers<T>) {
    const observer = new Observer<T>(handlers);
    const unsubscribe = this._subscribe(observer);
    observer._unsubscribe = unsubscribe;
    return {
      unsubscribe() {
        observer.unsubscribe();
      },
    };
  }
}

const HTTP_POST_METHOD = "POST";
const HTTP_GET_METHOD = "GET";
const HTTP_STATUS_OK = 200;
const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;

const userMock: UserMock = {
  name: "User Name",
  age: 26,
  roles: ["user", "admin"],
  createdAt: new Date(),
  isDeleated: false,
};

const requestsMock: RequestMockItem[] = [
  {
    method: HTTP_POST_METHOD,
    host: "service.example",
    path: "user",
    body: userMock,
    params: {},
  },
  {
    method: HTTP_GET_METHOD,
    host: "service.example",
    path: "user",
    params: {
      id: "3f5h67s4s",
    },
  },
];

const handleRequest = (request: RequestMockItem) => {
  // handling of request
  return { status: HTTP_STATUS_OK };
};
const handleError = (error: Error) => {
  // handling of error
  return { status: HTTP_STATUS_INTERNAL_SERVER_ERROR };
};

const handleComplete = () => console.log("complete");
const requests$ = Observable.from(requestsMock);
const subscription = requests$.subscribe({
  next: handleRequest,
  error: handleError,
  complete: handleComplete,
});
subscription.unsubscribe();
