import { Component, inject, Input, signal, ViewChild, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoComplete, AutoCompleteModule } from 'primeng/autocomplete';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { PaginationTableInput } from '../../../interfaces/pagination.interface';
import { CandidateService } from '../../../services/candidate.service';
import { Candidate } from '../../../interfaces/person.interface';
import { Router } from '@angular/router';
import { GlobalFunctionsService } from '../../../utils/services/global-functions.service';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

interface UserDataTable {
  id: string;
  name: string;
  email: any;
  gender: string;
}

@Component({
  selector: 'app-candidate-searcher',
  standalone: true,
  imports: [AutoCompleteModule, CommonModule, FormsModule],
  templateUrl: './candidate-searcher.component.html',
  styles: `
    :host ::ng-deep .p-autocomplete-panel .p-autocomplete-items .p-autocomplete-item {
      padding: 0.2rem 0.7rem;
    }
  `,
})
export class CandidateSearcherComponent {
  private router = inject(Router);
  private global = inject(GlobalFunctionsService);
  private candidateService = inject(CandidateService);
  @ViewChild('autoComplete') autoComplete!: AutoComplete;
  @Input() sidebar: boolean = true;
  selectedUser: UserDataTable | null = null;
  visible = true;
  filteredUsers: UserDataTable[] = [];
  pagination: PaginationTableInput = {
    total: 0,
    perPage: signal(10),
    page: signal(1),
  };
  search: WritableSignal<string> = signal('');
  roles = this.global.getRoles();
  canSearch = this.roles.includes('user') || this.roles.includes('recruiter');

  candidatesRequest = injectQuery(() => ({
    queryKey: ['candidates', { page: this.pagination.page(), perPage: this.pagination.perPage() }],
    queryFn: async () => {
      if (this.canSearch) {
        const response = await this.candidateService.getAllCandidates(this.search(), {
          page: this.pagination.page(),
          perPage: this.pagination.perPage(),
        });
        const { data, pagination } = response;
        this.pagination.total = pagination.totalItems ?? 0;
        this.filteredUsers = [];
        data.forEach((candidate: Candidate) => {
          {
            this.filteredUsers.push({
              id: candidate.id,
              name: [
                candidate.person.firstName,
                candidate.person.middleName,
                candidate.person.lastName,
                candidate.person.secondLastName,
              ]
                .filter(Boolean)
                .join(' '),
              email: candidate.person.user.email,
              gender: candidate.person.gender,
            });
          }
        });

        return response;
      }
      return { data: [] };
    },
  }));

  onSelect(event: any) {
    this.router.navigate(['/dashboard/red-talenthub/perfil-usuario', event.value.id]);
  }

  showMoreResults() {
    this.router.navigate(['/dashboard/red-talenthub']);
    this.autoComplete.hide();
  }

  async filterUsers(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    this.search.set(query);
    await this.candidatesRequest.refetch();
    this.filteredUsers.sort((a, b) => {
      return a.name.toLowerCase().indexOf(query) - b.name.toLowerCase().indexOf(query);
    });
  }
}
