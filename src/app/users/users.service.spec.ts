import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserIdentity } from '../shared/user-identity';
import { UserIdentityService } from '../shared/user-identity.service';
import { User } from './user';
import { UserPermissionResponse } from './user-permission-response';
import { UserPermissionScope } from './user-permission-scope';
import { UsersService } from './users.service';
import { UserRequest } from './user-request';
import { GlobalUserPermission } from '../permissions/global-user-permission';
import { GlobalUserPermissionResponse } from '../permissions/global-user-permission-response';
import { UserPermissionRequest } from '../permissions/user-permission-request';
import { GlobalPermissionScope } from '../permissions/global-permission-scope.enum';

const userIdentityServiceStub: Partial<UserIdentityService> = {
  getUserIdentity(): Observable<UserIdentity> { return null; }
};

const authenticatedUser: UserIdentity = {
  userId: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
  userName: 'tester',
  firstName: 'Toni',
  lastName: 'Tester',
  email: 'toni.tester@skoop.io',
  roles: ['ROLE_USER']
};

const userRequestData: UserRequest = {
  userName: 'tester',
  academicDegree: 'academic degree',
  positionProfile: 'position profile',
  summary: 'summary',
  industrySectors: ['sector1', 'sector2', 'sector3'],
  specializations: ['specialization1, specialization2, specialization3'],
  certificates: ['certificate1', 'certificate2', 'certificate3'],
  languages: ['language1', 'language2', 'language2']
};

describe('UsersService', () => {
  let service: UsersService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    spyOn(userIdentityServiceStub, 'getUserIdentity').and.returnValue(of(authenticatedUser));

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UsersService,
        { provide: UserIdentityService, useValue: userIdentityServiceStub }
      ]
    });

    service = TestBed.get(UsersService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should provide the user profile for the currently authenticated user', async(() => {
    const testUser: User = {
      id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
      userName: 'tester',
      firstName: 'Toni',
      lastName: 'Tester',
      email: 'toni.tester@skoop.io'
    };

    service.getUser().subscribe(user => {
      expect(user).toEqual(testUser);
    });

    const request = httpTestingController.expectOne({
      method: 'GET',
      url: `${environment.serverApiUrl}/users/${authenticatedUser.userId}`
    });

    expect(request.request.responseType).toEqual('json');
    request.flush(testUser);
  }));

  it('should provide the user profile for the given userId', async(() => {
    const testUser: User = {
      id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
      userName: 'tester',
      firstName: 'Toni',
      lastName: 'Tester',
      email: 'toni.tester@skoop.io'
    };

    service.getUserById('e6b808eb-b6bd-447d-8dce-3e0d66b17759').subscribe(user => {
      expect(user).toEqual(testUser);
    });

    const request = httpTestingController.expectOne({
      method: 'GET',
      url: `${environment.serverApiUrl}/users/${authenticatedUser.userId}`
    });

    expect(request.request.responseType).toEqual('json');
    request.flush(testUser);
  }));

  it('should update the user profile for the currently authenticated user with the given data', async(() => {
    const testUser: User = {
      id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
      userName: 'tester',
      firstName: 'Toni',
      lastName: 'Tester',
      email: 'toni.tester@skoop.io',
      academicDegree: 'academic degree',
      positionProfile: 'position profile',
      summary: 'summary',
      industrySectors: ['sector1', 'sector2', 'sector3'],
      specializations: ['specialization1', 'specialization2', 'specialization3'],
      certificates: ['certificate1', 'certificate2', 'certificate3'],
      languages: ['language1', 'language2', 'language2']
    };

    service.updateUser(userRequestData).subscribe(user => {
      expect(user).toEqual(testUser);
    });

    const request = httpTestingController.expectOne({
      method: 'PUT',
      url: `${environment.serverApiUrl}/users/${authenticatedUser.userId}`
    });

    expect(request.request.responseType).toEqual('json');
    expect(request.request.headers.get('Content-Type')).toEqual('application/json');
    expect(request.request.body).toEqual(userRequestData);

    request.flush(testUser);
  }));

  it('should provide user suggestions for the given search term', async(() => {
    const testUsers: User[] = [
      {
        id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
        userName: 'tester',
        firstName: 'Toni',
        lastName: 'Tester',
        email: 'toni.tester@skoop.io'
      },
      {
        id: '753cf4d3-863c-475d-8631-e68dffd1af2f',
        userName: 'testing',
        firstName: 'Tina',
        lastName: 'Testing',
        email: 'tina.testing@skoop.io'
      }
    ];

    service.getUserSuggestions('test').subscribe((users) => {
      expect(users).toEqual(testUsers);
    });

    const request = httpTestingController.expectOne((req) =>
      req.method === 'GET'
      && req.url === `${environment.serverApiUrl}/user-suggestions`
      && req.params.get('search') === 'test'
    );

    expect(request.request.responseType).toEqual('json');

    request.flush(testUsers);
  }));

  it('should provide the users authorized by the currently authenticated user for the given scope', async(() => {
    const testUsers: User[] = [
      {
        id: '753cf4d3-863c-475d-8631-e68dffd1af2f',
        userName: 'testing',
        firstName: 'Tina',
        lastName: 'Testing',
        email: 'tina.testing@skoop.io'
      },
      {
        id: '95470c7b-bf76-412a-b747-4448f4e11cc3',
        userName: 'testbed',
        firstName: 'Tabia',
        lastName: 'Testbed',
        email: 'tabia.testbed@skoop.io'
      }
    ];
    const testPermissions: UserPermissionResponse[] = [
      {
        owner: {
          id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
          userName: 'tester',
          firstName: 'Toni',
          lastName: 'Tester',
          email: 'toni.tester@skoop.io'
        },
        scope: UserPermissionScope.READ_USER_SKILLS,
        authorizedUsers: testUsers,
      }
    ];

    service.getPermissions().subscribe((permissions) => {
      expect(permissions).toEqual(testPermissions);
    });

    const request = httpTestingController.expectOne({
      method: 'GET',
      url: `${environment.serverApiUrl}/users/${authenticatedUser.userId}/outbound-permissions`
    });

    expect(request.request.responseType).toEqual('json');

    request.flush(testPermissions);
  }));

  it('should provide the users who have granted permission for the certain scope to the currently authenticated user', async(() => {
    const expectedOwners: User[] = [
      {
        id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
        userName: 'owner1',
        firstName: 'first',
        lastName: 'owner',
        email: 'first.owner@skoop.io'
      },
      {
        id: '666808eb-b6bd-447d-8dce-3e0d66b16666',
        userName: 'owner2',
        firstName: 'second',
        lastName: 'owner',
        email: 'second.owner@skoop.io'
      }
    ];
    const scope = UserPermissionScope.READ_USER_SKILLS;
    const testPermissions: UserPermissionResponse[] = [
      {
        owner: expectedOwners[0],
        scope: scope,
        authorizedUsers: [],
      },
      {
        owner: expectedOwners[1],
        scope: scope,
        authorizedUsers: [],
      }
    ];

    service.getPersonalPermissionOwnersByScope(scope).subscribe((owners) => {
      expect(owners).toEqual(expectedOwners);
    });

    const request = httpTestingController.expectOne({
      method: 'GET',
      url: `${environment.serverApiUrl}/users/${authenticatedUser.userId}/inbound-permissions?scope=${scope}`
    });

    expect(request.request.responseType).toEqual('json');

    request.flush(testPermissions);
  }));

  it('should provide the users who have granted global permission for the certain scope to the currently authenticated user', async(() => {
    const expectedOwners: User[] = [
      {
        id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
        userName: 'owner1',
        firstName: 'first',
        lastName: 'owner',
        email: 'first.owner@skoop.io'
      },
      {
        id: '666808eb-b6bd-447d-8dce-3e0d66b16666',
        userName: 'owner2',
        firstName: 'second',
        lastName: 'owner',
        email: 'second.owner@skoop.io'
      }
    ];
    const scope = GlobalPermissionScope.READ_USER_SKILLS;
    const testPermissions: GlobalUserPermissionResponse[] = [
      {
        owner: expectedOwners[0],
        scope: scope
      },
      {
        owner: expectedOwners[1],
        scope: scope
      }
    ];

    service.getGlobalPermissionOwnersByScope(scope).subscribe((owners) => {
      expect(owners).toEqual(expectedOwners);
    });

    const request = httpTestingController.expectOne({
      method: 'GET',
      url: `${environment.serverApiUrl}/users/${authenticatedUser.userId}/inbound-global-permissions?scope=${scope}`
    });

    expect(request.request.responseType).toEqual('json');

    request.flush(testPermissions);
  }));

  it('should update list of users who have granted permission to the currently authenticated user', async(() => {
    const users: User[] = [
      {
        id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
        userName: 'owner1',
        firstName: 'first',
        lastName: 'owner',
        email: 'first.owner@skoop.io'
      },
      {
        id: '666808eb-b6bd-447d-8dce-3e0d66b16666',
        userName: 'owner2',
        firstName: 'second',
        lastName: 'owner',
        email: 'second.owner@skoop.io'
      }
    ];
    const userPermissionRequests: UserPermissionRequest[] = [
      {
        scope: UserPermissionScope.READ_USER_SKILLS,
        authorizedUserIds: [users[0].id, users[1].id],
      },
      {
        scope: UserPermissionScope.READ_USER_PROFILE,
        authorizedUserIds: [users[0].id, users[1].id],
      }
    ];
    const expectedPermissions: UserPermissionResponse[] = [
      {
        owner: users[0],
        scope: UserPermissionScope.READ_USER_SKILLS,
        authorizedUsers: users,
      },
      {
        owner: users[0],
        scope: UserPermissionScope.READ_USER_PROFILE,
        authorizedUsers: users,
      }
    ];

    service.updatePermissions(userPermissionRequests).subscribe((permissions) => {
      expect(permissions).toEqual(expectedPermissions);
    });

    const request = httpTestingController.expectOne({
      method: 'PUT',
      url: `${environment.serverApiUrl}/users/${authenticatedUser.userId}/outbound-permissions`
    });

    expect(request.request.responseType).toEqual('json');

    request.flush(expectedPermissions);
  }));

  it('should provide list of global user permissions', async(() => {
    const expectedPermissions: GlobalUserPermissionResponse[] = [
      {
        scope: GlobalPermissionScope.READ_USER_PROFILE,
        owner: {
          id: '666808eb-b6bd-447d-8dce-3e0d66b16666',
          userName: 'owner2',
          firstName: 'second',
          lastName: 'owner',
          email: 'second.owner@skoop.io'
        }
      },
      {
        scope: GlobalPermissionScope.READ_USER_SKILLS,
        owner: {
          id: '666808eb-b6bd-447d-8dce-3e0d66b16666',
          userName: 'owner2',
          firstName: 'second',
          lastName: 'owner',
          email: 'second.owner@skoop.io'
        }
      }
    ];

    service.getGlobalUserPermissions().subscribe((permissions) => {
      expect(permissions).toEqual(expectedPermissions);
    });

    const request = httpTestingController.expectOne({
      method: 'GET',
      url: `${environment.serverApiUrl}/users/${authenticatedUser.userId}/outbound-global-permissions`
    });

    expect(request.request.responseType).toEqual('json');

    request.flush(expectedPermissions);
  }));

  it('should update list of global user permissions', async(() => {
    const globalPermissionsRequest: GlobalUserPermission[] = [
      {
        scope: GlobalPermissionScope.READ_USER_PROFILE
      },
      {
        scope: GlobalPermissionScope.READ_USER_SKILLS
      }
    ];

    const expectedPermissions: GlobalUserPermissionResponse[] = [
      {
        scope: GlobalPermissionScope.READ_USER_PROFILE,
        owner: {
          id: '666808eb-b6bd-447d-8dce-3e0d66b16666',
          userName: 'owner2',
          firstName: 'second',
          lastName: 'owner',
          email: 'second.owner@skoop.io'
        }
      },
      {
        scope: GlobalPermissionScope.READ_USER_SKILLS,
        owner: {
          id: '666808eb-b6bd-447d-8dce-3e0d66b16666',
          userName: 'owner2',
          firstName: 'second',
          lastName: 'owner',
          email: 'second.owner@skoop.io'
        }
      }
    ];

    service.updateGlobalUserPermissions(globalPermissionsRequest).subscribe((permissions) => {
      expect(permissions).toEqual(expectedPermissions);
    });

    const request = httpTestingController.expectOne({
      method: 'PUT',
      url: `${environment.serverApiUrl}/users/${authenticatedUser.userId}/global-permissions`
    });

    expect(request.request.responseType).toEqual('json');

    request.flush(expectedPermissions);
  }));
});
