import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Observable, of } from 'rxjs';

import { AppMaterialModule } from '../../app-material.module';
import { GlobalErrorHandlerService } from '../../error/global-error-handler.service';
import { SkillUsersReportComponent } from './skill-users-report.component';
import { SkillUserView } from '../../skill-users/skill-user.component';
import { UserSkillPriorityReportsService } from '../user-skill-priority-report/user-skill-priority-reports.service';
import { UserSkillPriorityReportSimple } from '../user-skill-priority-report/user-skill-priority-report-simple';
import { UserSkillPriorityReport } from '../user-skill-priority-report/user-skill-priority-report';
import { UserSkillReport } from '../shared/user-skill-report';

@Component({ selector: 'app-skill-user', template: '' })
class SkillUserStubComponent {
  @Input('skillUser')
  public skillUser: SkillUserView;
}

const userSkillPriorityReportsServiceStub: Partial<UserSkillPriorityReportsService> = {
  getReports(): Observable<UserSkillPriorityReportSimple[]> { return null; },
  getReportDetails(reportId: string): Observable<UserSkillPriorityReport> { return null; },
  getUserSkillReportsByAggregationReportId(reportId: string, aggregationReportId: string): Observable<UserSkillReport[]> { return null; }
};

describe('SkillUsersReportComponent', () => {
  let component: SkillUsersReportComponent;
  let fixture: ComponentFixture<SkillUsersReportComponent>;

  beforeEach(async(() => {
    spyOn(userSkillPriorityReportsServiceStub, 'getUserSkillReportsByAggregationReportId').and.returnValue(of<UserSkillReport[]>([{
      id: '9a96f28f-8f50-40d9-be1c-605aedd9dfc9',
      currentLevel: 2,
      desiredLevel: 3,
      priority: 4,
      skill: {
        name: 'Angular',
        description: 'JavaScript Framework'
      },
      user: {
        userName: 'tester',
        firstName: 'Toni',
        lastName: 'Tester'
      },
    }]));
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        AppMaterialModule
      ],
      declarations: [
        SkillUsersReportComponent,
        SkillUserStubComponent
      ],
      providers: [
        GlobalErrorHandlerService,
        { provide: UserSkillPriorityReportsService, useValue: userSkillPriorityReportsServiceStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillUsersReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
