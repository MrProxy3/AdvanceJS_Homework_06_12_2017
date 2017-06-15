$(function ($) {
    var $form = $(".users-edit");
    var $table = $("#users-table");

    $("#create").click(function () {
        $($form).removeClass("users-edit-hidden");
    });
    $("#cancel").click(function (e) {
        e.preventDefault();
        $($form).addClass("users-edit-hidden");
        clearForm();
    });
    addCountries();

    $.getJSON("/user", function (data) {
        for (var i = 0; i < data.length; i++) {
            addRow(data[i], $table);
        }
    });

    $($form).submit(function (e) {
        e.preventDefault();
        var createUser = {
            "id": this.elements.id.value,
            "fullName": this.fullName.value,
            "email": this.email.value,
            "birthday": this.birthday.value,
            "profession": this.profession.value,
            "address": this.address.value,
            "country": this.country.value,
            "shortInfo": this.shortInfo.value,
            "fullInfo": this.fullInfo.value
        };

        $.ajax({
            type: createUser.id ? "PUT" : "POST",
            contentType: "application/json",
            dataType: 'json',
            url: '/user',
            data: JSON.stringify(createUser)
        }).done(function (data) {
            var $rowExist = $("#" + data.id)[0];
            // $(document.getElementById(data.id));
            // $("#id").val(data.id)[0];
            addRow(data, $table, $rowExist);
            if ($rowExist) {
                // $($rowExist).before($rowExist);
                $($rowExist).remove();
            }
            clearForm();
        });
    });

    $($table).click(function (e) {
        if (e.target.tagName === "BUTTON") {
            var $id = $(e.target).attr("data-target");
            if ($(e.target).hasClass("removeBtn")) {
                $(e.target).closest('tr').remove();
                remove($id);
            } else if ($(e.target).hasClass("editBtn")) {
                edit($id);
            }

        }
    });


    function addRow(user, table, newBefore) {
        var $tr = $("<tr />")
            .attr("id", user.id)
            .appendTo(table);

        var $newTr = $($tr).get(0);
        $($newTr).before(newBefore);

        $("<td></td>")
            .text(user.fullName)
            .appendTo($tr);
        $("<td></td>")
            .text(user.profession)
            .appendTo($tr);
        $("<td></td>")
            .text(user.shortInfo)
            .appendTo($tr);
        var $controlCell = $("<td></td>")
            .appendTo($tr);
        $("<button type='button'>Remove</button>")
            .addClass("removeBtn")
            .attr("data-target", user.id)
            .appendTo($controlCell);
        $("<button type='button'>Edit</button>")
            .addClass("editBtn")
            .attr("data-target", user.id)
            .appendTo($controlCell);

        // $(table.insertBefore($tr, newBefore));
    }

    function remove(id) {
        $.ajax({
            type: "DELETE",
            dataType: "json",
            url: "/user?id=" + id
        }).done(function (data) {
            var $rowToDelete = data.id;
            $($rowToDelete).remove();
        });
    }

    function edit(id) {
        $.ajax({
            dataType: "json",
            url: "/user?id=" + id
        }).done(function (data) {
            $("#id").val(data.id);
            $("#fullName").val(data.fullName);
            $("#email").val(data.email);
            $("#birthday").val(data.birthday);
            $("#profession").val(data.profession);
            $("#address").val(data.address);
            $("#country").val(data.country);
            $("#shortInfo").val(data.shortInfo);
            $("#fullInfo").val(data.fullInfo);
            $($form).removeClass("users-edit-hidden");
        });
    }

    function addCountries() {
        $.getJSON("/countries", function (data) {
            var $select = $("#country");
            for (var i = 0; i < data.length; i++) {
                $("<option />")
                    .text(data[i])
                    .appendTo($select);
            }
        });
    }

    function clearForm() {
        $($form).find(':input').each(function () {
            switch (this.type) {
                case 'text':
                case 'textarea':
                case 'email':
                case 'hidden':
                    $(this).val('');
                    break;
            }
        });
    }

    function AddBefore(rowId){
        var target = document.getElementById(rowId);
        var newElement = document.createElement('tr');
        target.parentNode.insertBefore(newElement, target);
        return newElement;
    }

});