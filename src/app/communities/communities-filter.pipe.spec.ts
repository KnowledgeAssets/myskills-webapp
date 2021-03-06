import { CommunitiesFilterPipe } from './communities-filter.pipe';
import { CommunityType } from './community-type.enum';
import { CommunityResponse } from './community-response';

const communities: CommunityResponse[] = [
  {
    id: 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f',
    title: 'test1',
    description: 'description1',
    type: CommunityType.OPEN,
    links: [
      {
        id: '12345',
        name: 'google',
        href: 'https://www.google.com'
      },
      {
        id: '342374',
        name: 'stackoveflow',
        href: 'https://stackoverflow.com/'
      }
    ],
    managers: []
  },
  {
    id: '6b7ebd19-4542-4c1d-9602-905e35b7f7f8',
    title: 'test2',
    description: 'description2',
    type: CommunityType.OPEN,
    skills: [{
      id: '12343534536',
      name: 'java'
    }],
    managers: []
  }
];

describe('CommunitiesFilterPipe', () => {
  const pipe = new CommunitiesFilterPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the original list when the filter value is empty', () => {
    expect(pipe.transform(communities, '')).toEqual(communities);
  });

  it('should filter the list of communities by name', () => {
    expect(pipe.transform(communities, 'test1')).toEqual([communities[0]]);
  });

  it('should filter the list of communities by skill', () => {
    expect(pipe.transform(communities, 'ja')).toEqual([communities[1]]);
  });
});
