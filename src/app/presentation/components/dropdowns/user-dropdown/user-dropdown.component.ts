import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, AfterViewInit, ViewChild, ElementRef, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Session } from '../../../interfaces/user.interface';
import { createPopper } from '@popperjs/core';
import { logout } from '../../../store/auth.actions';
import { Router, RouterLink } from '@angular/router';
import { map, Observable, shareReplay, timer } from 'rxjs';
import { CandidateService } from '../../../services/candidate.service';
import { getPersonLocalStorage } from '../../../utils/local-storage.utils';
import { saveFile } from '../../../utils/file.utils';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import { toast } from 'ngx-sonner';
import { SpinnerComponent } from '../../spinner/spinner.component';

@Component({
  selector: 'app-user-dropdown',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, SpinnerComponent, RouterLink],
  templateUrl: './user-dropdown.component.html',
})
export class UserDropdownComponent implements AfterViewInit {
  dropdownPopoverShow = false;
  private store = inject(Store);
  private router = inject(Router);
  private candidateService = inject(CandidateService);
  sessionValue: Session | undefined;
  private queryClient = injectQueryClient();
  person = getPersonLocalStorage();

  private _time$: Observable<Date> = timer(0, 1000).pipe(
    map(() => new Date()),
    shareReplay(1),
  );

  @ViewChild('btnDropdownRef', { static: false }) btnDropdownRef!: ElementRef | undefined;
  @ViewChild('popoverDropdownRef', { static: false })
  popoverDropdownRef!: ElementRef;
  constructor() {
    this.btnDropdownRef = undefined;
    this.store.select('session').subscribe((session) => {
      this.sessionValue = session;
    });
  }
  ngAfterViewInit() {
    createPopper(this.btnDropdownRef!.nativeElement, this.popoverDropdownRef.nativeElement, {
      placement: 'bottom',
    });
  }
  toggleDropdown(event: any) {
    event.preventDefault();
    this.dropdownPopoverShow = !this.dropdownPopoverShow;
  }

  logout() {
    this.store.dispatch(logout());
    this.router.navigate(['/']);
  }

  downloadFileMutation = injectMutation(() => ({
    mutationFn: async () => await this.candidateService.downloadCV(this.person.candidateId),
    onSuccess: async () => {
      toast.success('Curriculum generado correctamente', { duration: 3000 });
      await this.queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  }));

  async downloadCV() {
    try {
      const buffer = await this.downloadFileMutation.mutateAsync();
      const filename = `CV - ${this.person.firstName} ${this.person.middleName} ${this.person.lastName} ${this.person.secondLastName}.pdf`;

      saveFile(buffer, filename);
    } catch (error) {
      console.error('Error al descargar CV:', error);
    }
  }

  get time() {
    return this._time$;
  }
}
