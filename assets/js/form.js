$(function(){

   /*********************/
   
   let date = new Date();

   date.setFullYear(date.getFullYear() - 18);
   date.setHours(0);
   date.setMilliseconds(0);
   date.setMinutes(0);
   date.setSeconds(0);

   if($('#birthday').val()){
      let current = $('#birthday').val();
      $('#birthday').datetimepicker({
         format: "MM/DD/YYYY",
         maxDate: date
      });
      $('#birthday').val(current);
   }else{
      $('#birthday').datetimepicker({
         format: "MM/DD/YYYY",
         maxDate: date
      });
   }
   
   /*********************/

   $('#salary').maskMoney({
      thousands: '',
      decimal: '.',
      precision: 2,
      allowZero: true,
      allowNegative: false,
      allowEmpty: false
   });

   /*********************/

   $("#divErrors").fadeOut(5000);

   /*********************/

   $("#btnModalEdit").click(() => {
      $("#question").text("Do you want edit?");
      $("#btnEdit").show();
      $("#btnDelete").hide();
      $("#mdEdit").modal("show");
   });

   $("#btnModalDelete").click(() => {
      $("#question").text("Do you want delete?");
      $("#btnEdit").hide();
      $("#btnDelete").show();
      $("#mdEdit").modal("show");
   });

   /*********************/
});