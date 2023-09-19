import Swal from 'sweetalert2';
const AlertConfirm = (title, message, callback) => {
       
    Swal.fire({
        title: title,
        text: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK, Xác nhận xóa!'
      }).then((result) => {
        if (result.isConfirmed) {
            callback();
        }
      })
}

export const ConfirmAlert = AlertConfirm;