import { DecimalPipe } from '@angular/common';
import { Component, Input, OnInit, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { RegisterHarvest } from 'src/app/_models/register-harvest';
import { HarvestService } from 'src/app/_services/harvest/harvest.service';

@Component({
  selector: 'app-registers-harvest',
  templateUrl: './registers-harvest.component.html',
  styleUrls: ['./registers-harvest.component.css']
})
export class RegistersHarvestComponent implements OnInit {
  @Input() public id: string;
  @BlockUI('registerHarvest') blockUIHarvest: NgBlockUI;

  public title: string;
  public options = {
    close: false,
    expand: true,
    minimize: true,
    reload: true
  };
  public headElements = ['Run', 'Nombre', 'Peso acumulado', 'Fecha término', 'Acciones'];
  private registerHarvests: RegisterHarvest[];
  public collectionSize: any;
  public page = 1;
  public pageSize = 4;
  public pipe: any;
  public harvestSearch: Observable<RegisterHarvest[]>;
  public filter = new FormControl('');
  private dataToExport = [];
  public from = new Date('December 25, 1995 13:30:00');;
  public to = new Date();

  constructor(
    public activeModal: NgbActiveModal,
    private harvestService: HarvestService,
  ) { }

  ngOnInit(): void {
    this.title = "Registros de las cosechas";
    this.getFullInfoRegisterHarvest();
  }

  exportToExcel() {
    console.log("this.dataToExport", this.dataToExport);
  }

  showDetails(id: string): void {
    console.log("ID" + id);
  }

  getFullInfoRegisterHarvest(): void {
    this.blockUIHarvest.start("Cargando...");
    this.harvestService.getFullInfoRegisterHarvest(this.id).subscribe(data => {
      this.registerHarvests = data;
      this.collectionSize = this.registerHarvests.length;
      this.searchData(this.pipe);
      this.getDataToExport();
      this.blockUIHarvest.stop();
    });
  }

  /**
    *
    * '@param' pipe
    */
  searchData(pipe: DecimalPipe) {
    this.harvestSearch = this.filter.valueChanges.pipe(
      startWith(''),
      map(text => this.search(text, pipe))
    );
  }

  /**
   * Search table
   * '@param' text
   * '@param' pipe
   */
  search(text: string, pipe: PipeTransform) {
    return this.registerHarvests.filter(response => {
      const term = text.toLowerCase();
      return response.name.toLowerCase().includes(term) ||
        response.id.toLowerCase().includes(term)
    });
  }

  getDataToExport(): void {
    this.harvestSearch.subscribe(data => {
      this.dataToExport = data;
    });
  }


  reload(): void {
    this.getFullInfoRegisterHarvest();
  }

}
