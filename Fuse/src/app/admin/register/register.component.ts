import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { NgForm } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { UserService } from '../../shared/user.service';

@Component({
    selector     : 'register',
    templateUrl  : './register.component.html',
    styleUrls    : ['./register.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class RegisterComponent implements OnInit, OnDestroy
{
    registerForm: FormGroup;

    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  showSucessMessage: boolean;
  serverErrorMessages: string;
  register:any;

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private userService: UserService
    )
    {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {

        // this.registerForm = this._formBuilder.group({
        //     fullName           : ['', Validators.required],
        //     email          : ['', [Validators.required, Validators.email]],
        //     password       : ['', Validators.required],
        //     // passwordConfirm: ['', [Validators.required, confirmPasswordValidator]]
        // });

        // console.log(this.registerForm.value);
       
      
        // Update the validity of the 'passwordConfirm' field
        // when the 'password' field changes
        // this.registerForm.get('password').valueChanges
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(() => {
        //         this.registerForm.get('passwordConfirm').updateValueAndValidity();
        //     });
    }


    onSubmit(form: NgForm) {
      this.userService.postUser(form.value).subscribe(
        res => {
          this.showSucessMessage = true;
          setTimeout(() => this.showSucessMessage = false, 4000);
          this.resetForm(form);
          console.log("Success");
        },
        err => {
          if (err.status === 422) {
            this.serverErrorMessages = err.error.join('<br/>');
          }
          else
            this.serverErrorMessages = 'Something went wrong.Please contact admin.';
        }
      );
    }


    
    resetForm(form: NgForm) {
      this.userService.selectedUser = {
        fullName: '',
        email: '',
        password: ''
      };
      form.resetForm();
      this.serverErrorMessages = '';
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}

// /**
//  * Confirm password validator
//  *
//  * @param {AbstractControl} control
//  * @returns {ValidationErrors | null}
//  */
// export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

//     if ( !control.parent || !control )
//     {
//         return null;
//     }

//     const password = control.parent.get('password');
//     const passwordConfirm = control.parent.get('passwordConfirm');

//     if ( !password || !passwordConfirm )
//     {
//         return null;
//     }

//     if ( passwordConfirm.value === '' )
//     {
//         return null;
//     }

//     if ( password.value === passwordConfirm.value )
//     {
//         return null;
//     }

//     return {'passwordsNotMatching': true};
// };
