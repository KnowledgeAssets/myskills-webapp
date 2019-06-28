import { async, TestBed } from '@angular/core/testing';

import { UserProfileSearchService } from './user-profile-search.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserProfileSearchResult } from './user-profile-search-result';

describe('UserProfileSearchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  let searchService: UserProfileSearchService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ UserProfileSearchService ]
    });

    searchService = TestBed.get(UserProfileSearchService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(searchService).toBeTruthy();
  });

  it('should provide a list of found users', async(() => {
    const expectedUsers: UserProfileSearchResult[] = [
      {
        id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
        userName: 'tester',
        firstName: 'Toni',
        lastName: 'Tester',
        email: 'toni.tester@skoop.io',
        manager: {
          id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
          userName: 'manager',
          firstName: 'Manager',
          lastName: 'Manager',
          email: 'manager.manager@skoop.io'
        }
      }
    ];
    const terms = ['Java', '"java script"'];
    searchService.search(terms).subscribe(users => {
      expect(users).toEqual(expectedUsers);
    });

    const request = httpTestingController.expectOne((req) =>
      req.method === 'GET'
      && req.url === '/assets/mock/search-result.json'
      && req.params.get('terms') === 'Java,"java script"'
    );

    expect(request.request.responseType).toEqual('json');
    request.flush(expectedUsers);
  }));
});
